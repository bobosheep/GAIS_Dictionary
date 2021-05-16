import os
from dotenv import load_dotenv
from pathlib import Path  # Python 3.6+ only


env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

CONFIG = {}

CONFIG['ENV']           = os.getenv('ENV')
CONFIG['DEBUG']         = os.getenv('DEBUG')

CONFIG['SERVER_IP']     = os.getenv('SERVER_IP')
CONFIG['SERVER_PORT']   = os.getenv('SERVER_PORT')
CONFIG['CORS']          = os.getenv('CORS')
CONFIG['SECRET_KEY']    = os.getenv('SECRET_KEY')
CONFIG['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')
CONFIG['DOWNLOAD_FOLDER'] = os.getenv('DOWNLOAD_FOLDER')
CONFIG['ALLOWED_EXTENSIONS'] = os.getenv('ALLOWED_EXTENSIONS')

CONFIG['MONGODB_ADDRESS']   = os.getenv('MONGODB_ADDRESS')
CONFIG['MONGODB_NAME']      = os.getenv('MONGODB_NAME')
CONFIG['MONGODB_USER']      = os.getenv('MONGODB_USER')
CONFIG['MONGODB_PASSWD']    = os.getenv('MONGODB_PASSWD')

CONFIG['PROJECT_DIR']       = os.getenv('PROJECT_DIR')