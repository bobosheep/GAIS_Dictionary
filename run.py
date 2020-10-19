import flaskr
import config

cfg = config.CONFIG
app = flaskr.start_app(cfg)
app.run(cfg['SERVER_IP'], port=cfg['SERVER_PORT'])