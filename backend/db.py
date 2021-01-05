from mongoengine import *
from datetime import datetime

class User(DynamicDocument):
    uid = StringField(primary_key=True)
    social_uid = StringField()
    uname = StringField(unique=True)
    display_name = StringField(max_length=12, min_length=2)
    password = StringField()
    level = IntField(min_value=0, max_value=5)
    activated = BooleanField(default=False)
    register_time = DateTimeField()
    register_date = DateField()
    last_login = DateTimeField()
    email = EmailField()
    avatar = StringField()
    prefer = DictField()

    @queryset_manager
    def this_month_register(doc_cls, queryset):
        now = datetime.now()
        print('this month',now.month)
        day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        day[1] = 29 if now.year % 400 == 0 or (now.year % 100 != 0  and now.year % 4 == 0) else 28
        month_start = datetime(now.year, now.month, 1)
        month_end = datetime(now.year, now.month, day[now.month - 1], 23, 59, 59)

        return queryset.filter(Q(register_time__gte=month_start) & Q(register_time__lte=month_end))

class UserLog(Document):
    log_id = StringField(primary_key=True)
    level = IntField()          # 0: INFO, 1: WARN, 2:ERROR, 3: FATAL 
    action = StringField()         # 瀏覽, 新增, 更新, 刪除, 登入, 登出
    action_time = DateTimeField()
    action_date = DateField()
    action_part = GenericReferenceField()
    action_description = StringField()
    action_stat = BooleanField()
    user = ReferenceField(User)
    user_ip = StringField()
    
    @queryset_manager
    def objects(doc_cls, queryset):
        # This may actually also be done by defining a default ordering for
        # the document, but this illustrates the use of manager methods
        return queryset.order_by('-action_time')

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
        month_end = datetime(now.year, now.month, day[now.month - 1], 23, 59, 59)

        return queryset.filter(Q(action_time__gte=month_start) & Q(action_time__lte=month_end))

class Report(Document):
    report_id = StringField(primary_key=True)
    user = ReferenceField(User)
    report_time = DateTimeField()
    report_date = DateField()
    report_content = StringField()
    report_status = IntField()      # 0: Not processing 1: Processing 2: Processed
    report_reply = StringField()

    @queryset_manager
    def objects(doc_cls, queryset):
        return queryset.order_by('+report_date', '-report_status')



class Term(Document):
    tname = StringField(unique=True)
    word_length = IntField()
    creator = ReferenceField(User)
    created = DateTimeField()
    editors = ListField(ReferenceField(User))
    last_updated = DateTimeField()
    view_cnt = IntField()
    edit_cnt = IntField()

    meta = {
        'allow_inheritance': True,
    }


class Category(Document):
    cid = StringField(primary_key=True)
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
    model = StringField()
    image_urls = ListField(StringField())
    meta = {'allow_inheritance': True}

class CategoryNode(Category):
    parent = ReferenceField(Category)
    has_children = BooleanField()
    children = ListField(ReferenceField(Category))
    meta = {'allow_inheritance': True}
    seeds = ListField(StringField())
    terms = ListField(StringField())
    remove_terms = ListField(StringField())




class TermDetail(Term):
    pos = ListField(StringField())
    chuyin = ListField(StringField())
    categories = ListField(ReferenceField(Category))
    tags = ListField(StringField())
    aliases = ListField(StringField())
    synonym = ListField(StringField())
    related_synonym = ListField(StringField())
    antonym = ListField(StringField())
    volume = DictField()
    frequency = IntField()
    meaning = StringField()
    imgs = ListField(DictField())

    meta = {
        'indexes': [{
            'fields': ['$tname', "$chuyin", '$tags', '$aliases'],
            'default_language': 'english',
            'weights': {'tname': 5, 'chuyin': 2, 'tags': 3, 'aliases': 4}
        }]
    }

class NewTerm(Document):
    tname = StringField(unique=True)
    word_length = IntField()
    creator = ReferenceField(User)
    created = DateTimeField()
    accepts = ListField(ReferenceField(User))
    rejects = ListField(ReferenceField(User))
    check_time = DateTimeField()
    checked = BooleanField()
    is_new_term = BooleanField()
    frequency = IntField()

    @queryset_manager
    def objects(doc_cls, queryset):
        # This may actually also be done by defining a default ordering for
        # the document, but this illustrates the use of manager methods
        return queryset.order_by('-created', '-frequency')
