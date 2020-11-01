import backend
import config
from mongoengine import connect

cfg = config.CONFIG
connect('test', 'localhost', )
connect(cfg['MONGODB_NAME'], host=cfg['MONGODB_ADDRESS'], port=cfg['MONGODB_PORT'])
app = backend.start_app(cfg)
app.run(cfg['SERVER_IP'], port=cfg['SERVER_PORT'])