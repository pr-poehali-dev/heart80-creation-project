"""
Управление анкетами Heart80:
- GET /?action=rating — публичный рейтинг (только оценённые)
- GET / — все анкеты (для админа)
- POST / — подать новую анкету
- PUT /?id=X — выставить оценку (требует заголовок X-Admin-Password)
"""
import json
import os
import psycopg2

SCHEMA = "t_p93967550_heart80_creation_pro"
ADMIN_PASSWORD = "heart80admin"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    if method == "GET" and action == "rating":
        return get_rating()

    if method == "GET":
        return get_all()

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        return create_submission(body)

    if method == "PUT":
        sub_id = params.get("id", "")
        body = json.loads(event.get("body") or "{}")
        admin_pw = (event.get("headers") or {}).get("X-Admin-Password", "")
        return rate_submission(sub_id, body, admin_pw)

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}


def get_rating():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, artist, release_link, tg_link, score_text, score_quality, "
        f"score_charisma, score_structure, score_vibe, score_hit, total, submitted_at "
        f"FROM {SCHEMA}.submissions WHERE rated = TRUE ORDER BY total DESC"
    )
    rows = cur.fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "id": r[0], "artist": r[1], "releaseLink": r[2], "tgLink": r[3],
            "scores": {
                "text": r[4], "quality": r[5], "charisma": r[6],
                "structure": r[7], "vibe": r[8], "hit": r[9]
            },
            "total": r[10],
            "submittedAt": r[11].strftime("%Y-%m-%d") if r[11] else "",
            "rated": True,
        })
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(result, ensure_ascii=False)}


def get_all():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, artist, release_link, tg_link, description, rated, "
        f"score_text, score_quality, score_charisma, score_structure, score_vibe, score_hit, total, submitted_at "
        f"FROM {SCHEMA}.submissions ORDER BY submitted_at DESC"
    )
    rows = cur.fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "id": r[0], "artist": r[1], "releaseLink": r[2], "tgLink": r[3],
            "description": r[4], "rated": r[5],
            "scores": {
                "text": r[6], "quality": r[7], "charisma": r[8],
                "structure": r[9], "vibe": r[10], "hit": r[11]
            } if r[5] else None,
            "total": r[12] if r[5] else None,
            "submittedAt": r[13].strftime("%Y-%m-%d") if r[13] else "",
        })
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(result, ensure_ascii=False)}


def create_submission(body: dict):
    artist = (body.get("artist") or "").strip()
    release_link = (body.get("releaseLink") or "").strip()
    tg_link = (body.get("tgLink") or "").strip()
    description = (body.get("description") or "").strip()

    if not artist or not release_link or not tg_link or not description:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Все поля обязательны"})}

    words = len(description.split())
    if words > 80:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Описание не более 80 слов"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.submissions (artist, release_link, tg_link, description) "
        f"VALUES (%s, %s, %s, %s) RETURNING id",
        (artist, release_link, tg_link, description)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    return {"statusCode": 201, "headers": CORS, "body": json.dumps({"id": new_id, "ok": True})}


def rate_submission(sub_id: str, body: dict, admin_pw: str):
    if admin_pw != ADMIN_PASSWORD:
        return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Неверный пароль"})}

    scores = body.get("scores", {})
    text = int(scores.get("text", 0))
    quality = int(scores.get("quality", 0))
    charisma = int(scores.get("charisma", 0))
    structure = int(scores.get("structure", 0))
    vibe = int(scores.get("vibe", 0))
    hit = int(scores.get("hit", 0))
    total = text + quality + charisma + structure + vibe + hit

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.submissions SET rated=TRUE, "
        f"score_text=%s, score_quality=%s, score_charisma=%s, "
        f"score_structure=%s, score_vibe=%s, score_hit=%s, "
        f"total=%s, rated_at=NOW() WHERE id=%s",
        (text, quality, charisma, structure, vibe, hit, total, sub_id)
    )
    conn.commit()
    conn.close()
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "total": total})}