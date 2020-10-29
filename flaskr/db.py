from mongoengine import *
from datetime import datetime
connect('test', host='localhost', port=27017)

class User(DynamicDocument):
    uid = UUIDField(binary=False)
    social_uid = StringField()
    uname = StringField(unique=True)
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
    level = IntField()          # 0: INFO, 1: WARN, 2:ERROR, 3: FATAL 
    action = StringField()         # GET, POST, PUT, DELETE
    action_time = DateTimeField()
    action_part = GenericReferenceField()
    action_description = StringField()
    action_stat = BooleanField()
    user = ReferenceField(User)
    user_ip = StringField()
    
    @queryset_manager
    def objects(doc_cls, queryset):
        # This may actually also be done by defining a default ordering for
        # the document, but this illustrates the use of manager methods
        return queryset.order_by('-date')

    @queryset_manager
    def this_week_actions(doc_cls, queryset):
        isocalendar = datetime.now().isocalendar()
        day_count = datetime.now().toordinal()
        week_start = datetime.fromordinal(day_count - isocalendar[2] + 1)
        week_end = datetime.fromordinal(day_count - isocalendar[2] + 7)

        return queryset.filter(Q(action_time__gte=week_start) & Q(action_time__lt=week_end))

    @queryset_manager
    def this_month_actions(doc_cls, queryset):
        now = datetime.now()
        day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        day[1] = 29 if now.year % 400 == 0 or (now.year % 100 != 0  and now.year % 4 == 0) else 28
        month_start = datetime(now.year, now.month, 1)
        month_end = datetime(now.year, now.month, day[now.month], 23, 59, 59)

        return queryset.filter(Q(action_time__gte=month_start) & Q(action_time__lte=month_end))


class Term(Document):
    tid = UUIDField(binary=False)
    tname = StringField(unique=True)

    meta = {'allow_inheritance': True}


class Category(Document):
    cid = UUIDField(binary=False)
    cname = StringField(unique=True)
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
    model = StringField()
    meta = {'allow_inheritance': True}

class CategoryNode(Category):
    parent = ReferenceField(Category)
    has_children = BooleanField()
    children = ListField(ReferenceField(Category))
    meta = {'allow_inheritance': True}

class CategoryLeaf(CategoryNode):
    seeds = ListField(StringField())
    terms = ListField(StringField())
    remove_terms = ListField(StringField())




class TermDetail(Term):
    categories = ListField(ReferenceField(Category))
    tags = ListField(StringField())
    aliases = ListField(StringField())
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


