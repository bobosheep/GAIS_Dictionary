from mongoengine import *
from datetime import datetime
connect('test', host='localhost', port=27017)

class User(DynamicDocument):
    uid = UUIDField(binary=False)
    social_uid = StringField()
    uname = StringField()
    display_name = StringField(max_length=12, min_length=2)
    password = StringField()
    level = IntField(min_value=0, max_value=5)
    activated = BooleanField(default=False)
    regist_date = DateTimeField()
    last_login = DateTimeField()
    email = EmailField()
    avatar = StringField()
    prefer = DictField()

class UserLog(Document):
    level = IntField()
    action = StringField()
    action_date = DateField()
    action_time = DateTimeField()
    action_part = StringField()
    user = ReferenceField(User)
    user_ip = StringField()



class Term(Document):
    tid = UUIDField(binary=False)
    tname = StringField()

    meta = {'allow_inheritance': True}


class Category(Document):
    cid = UUIDField(binary=False)
    cname = StringField()
    created = DateTimeField()
    last_updated = DateTimeField()
    is_root = BooleanField()
    creator = ReferenceField(User)
    editors = ListField(ReferenceField(User))
    child_mutex = BooleanField()
    root_cat = StringField()
    view_cnt = IntField()
    edit_cnt = IntField()
    published = BooleanField()

    meta = {'allow_inheritance': True}

class CategoryNode(Category):
    parent = ReferenceField(Category)
    children = ListField(ReferenceField(Category))
    meta = {'allow_inheritance': True}

class CategoryLeaf(CategoryNode):
    seeds = ListField(StringField())
    terms = ListField(StringField())
    remove_terms = ListField(StringField())




class TermDetail(Term):
    categories = ListField(ReferenceField(Category))
    tags = ListField(StringField())
    alias = ListField(StringField())
    synonym = ListField(StringField())
    related_synonym = ListField(StringField())
    antonym = ListField(StringField())
    volume = DictField()
    chuyin = ListField(StringField())
    meaning = StringField()
    imgs = ListField(ImageField())
    last_updated = DateTimeField()
    view_cnt = IntField()
    edit_cnt = IntField()


