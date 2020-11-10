import backend
import config
from mongoengine import connect

if __name__ == "__main__":
    cfg = config.CONFIG
    connect(cfg['MONGODB_NAME'], host=cfg['MONGODB_ADDRESS'])
    app = backend.start_app(cfg)
    app.run(cfg['SERVER_IP'], port=cfg['SERVER_PORT'], debug=cfg['DEBUG'])
