import uuid
import config
import os
from mongoengine import connect
from datetime import datetime, date
from backend.db import User, CategoryNode, TermDetail
from werkzeug.security import check_password_hash, generate_password_hash

def insertUser(name, password, email, displayName='', level=2, activated=False):
    # Check if it exist
    userExist = User.objects(uname=name)
    emailExist = User.objects(email=email)
    if userExist:
        return False, 'User exist!'
    elif emailExist:
        return False, 'Email exist!'
    else:
        displayName = name if displayName == '' else displayName
        newUser = User( uid=str(uuid.uuid4())[:8], uname=name, 
                        password=generate_password_hash(password), 
                        level=level, email=email, register_date=date.today(),register_time=datetime.now(),
                        activated=activated, display_name=displayName
                    )
        newUser.save()
        return True 

def insertCategory(cname, is_root, editor_name, child_mutex=False, parent_name=None, seeds=[], terms=[]):
    
    cat = CategoryNode.objects(cname=cname).first()
    editor = User.objects(uname=editor_name).first()
    if cat is not None:
        return False, f'Category {cname} exist!'
    elif editor is None:
        return False, f'User {editor_name} not found!'
    else:
        if is_root:
            new_cat = CategoryNode( cid=str(uuid.uuid4())[:8], cname=cname, 
                                is_root=True, child_mutex=child_mutex,
                                root_cat=cname, view_cnt=0, edit_cnt=0,
                                editors=[editor], created=datetime.now(),
                                creator=editor, published=True)

            new_cat.save()
            return True, f'Root category {cname} create successfully!'
        elif parent_name is not None:
            parent = CategoryNode.objects(cname=parent_name).first()

            if parent is None:
                return False, f'Parent Category {parent_name} does not exist!'

            new_child_cat = CategoryNode(cid=str(uuid.uuid4())[:8], cname=cname, 
                                        is_root=False, child_mutex=False,
                                        root_cat=parent.root_cat, view_cnt=0, edit_cnt=0,
                                        editors=[editor], parent=parent,
                                        terms=terms, seeds=seeds, created=datetime.now(),
                                        creator=editor, published=True
                                        )
            new_child_cat.save()
            parent.children.append(new_child_cat)
            parent.save()
            return True, f'Child category {cname} create successfully!'
        return False, 'Parameter error!'

def insertTerm(tname, creator_name, frequency=0, meaning='', tags=[], pos=[], chuyin=[], aliases=[], synonym=[], related_synonym=[], antonym=[], categories=[]):
    
    term = TermDetail.objects(tname=tname).first()
    creator = User.objects(uname=creator_name).first()
    if term is not None:
        return False, f'Term {term} exist!'
    elif creator is None:
        return False, f'User {creator_name} not found!'
    else:
        new_term = TermDetail(tname=tname, word_length=len(tname), pos=pos, chuyin=chuyin, 
                              creator=creator, editors=[creator], frequency=frequency, aliases=aliases, related_synonym=related_synonym, antonym=antonym,
                              created=datetime.now(), view_cnt=0, edit_cnt=0, tags=tags, imgs=[], meaning=meaning)
        
        new_term.categories = []
        for cat in categories:
            cat_doc = CategoryNode.object(cname=cat).first()
            new_term.categories.append(cat_doc)
        new_term.save()


def insertCatFromDir(dir_path):
    print('Load stat')
    if not os.path.exists(dir_path):
        print(dir_path + ' is not exist.')
        return False
    for  root, dirs, files in os.walk(dir_path):
        for name in files:
            p_class = root.split('/')[-1]
            cur_class = name.split('.')[0]
            if root == dir_path or name.split('.')[-1] != 'dic':
                continue
            filename = root + '/' + name
            p_class = p_class.split('\\')[-1]
            print('parent class: ', p_class)
            cat = CategoryNode.objects(cname=p_class).first()
            if cat is None:
                insertCategory(p_class, True, 'bobosheep')
            print('cur class: ', cur_class)
            with open(filename, 'r', encoding='utf-8') as fp:
                seeds = []
                candidates = []
                for line in fp.readlines():
                    line = line.replace('\n', '')
                    term = line.split('\t')
                    if len(term) > 1:
                        # candidates
                        candidates.append(term[0])
                    else:
                        #seed
                        seeds.append(term[0])
                
                insertCategory(cur_class, False, 'bobosheep', parent_name=p_class, 
                    seeds=seeds, 
                    terms=list(set(seeds + candidates)))
                # self.addClass(p_class, cur_class, seeds, candidates=candidates)
                fp.close()

def insertTermFile(fname):
    
    with open(fname, 'r', encoding='utf-8') as fp:
        for line in fp.readlines():
            line = line.strip('\n')
            tmp = line.split(' ')
            term = ' '.join(tmp[:-1])
            fq = int(tmp[-1]) if len(tmp) > 1 and int(tmp[-1]) > 1 else 1
            insertTerm(term, 'bobosheep', fq)


if __name__ == "__main__" :
    cfg = config.CONFIG
    connect(cfg['MONGODB_NAME'], host=cfg['MONGODB_ADDRESS'])
    # insertUser('bobosheep', 'h941i6u;6', 'ianpaul32@gmail.com', 'BoBoSheep', level=0, activated=True)
    # insertUser('admin', 'e94g4g6u04g4', 'gaispdta@gmail.com', 'GAIS Admin', level=0, activated=True)
    # insertUser('gais editor', '123456789', 'hello1@world.com', '蓋世編輯家', level=1, activated=True)
    # insertUser('gais viewer', '123456789', 'hello2@world.com', '蓋世瀏覽員', level=2, activated=False)
    # insertUser('gais viewer1', '123456789', 'hello3@world.com', '蓋世瀏覽家', level=2, activated=True)

    # insertCategory('影視娛樂', True, 'bobosheep')
    # insertCategory('電影', False, 'bobosheep', parent_name='影視娛樂')
    # insertCategory('熱門院線', False, 'bobosheep', parent_name='電影', 
    #                 seeds=['鋼鐵人','屍速列車','冰原歷險記','哈利波特', '復仇者聯盟'], 
    #                 terms=['鋼鐵人','屍速列車','冰原歷險記','哈利波特', '復仇者聯盟', '蜘蛛人'])
    # insertCategory('經典影片', False, 'bobosheep', parent_name='電影', 
    #                 seeds=['鐵達尼號','復仇者聯盟','阿甘正傳','星際大戰','三個傻瓜'], 
    #                 terms=['鐵達尼號','復仇者聯盟','阿甘正傳','星際大戰','三個傻瓜'])
    # insertCategory('動畫電影', False, 'bobosheep', parent_name='電影', 
    #                 seeds=['冰雪奇緣','神隱少女','霍爾的移動城堡','超人特攻隊','玩具總動員'], 
    #                 terms=['冰雪奇緣','神隱少女','霍爾的移動城堡','超人特攻隊','玩具總動員', '冰原歷險記'])
    # insertCategory('電視', False, 'bobosheep', parent_name='影視娛樂')
    # insertCategory('綜藝節目', False, 'bobosheep', parent_name='電視', 
    #                 seeds=['綜藝大熱門','娛樂百分百','食尚玩家','醫師好辣','天才衝衝衝'], 
    #                 terms=['綜藝大熱門','娛樂百分百','食尚玩家','醫師好辣','天才衝衝衝'])
    # insertCategory('連續劇', False, 'bobosheep', parent_name='電視', 
    #                 seeds=['後宮甄嬛傳','痞子英雄','我們與惡的距離','想見你','通靈少女'], 
    #                 terms=['後宮甄嬛傳','痞子英雄','我們與惡的距離','想見你','通靈少女'])
    # insertCategory('人物', True, 'bobosheep')
    # insertCategory('Youtuber', False, 'bobosheep', parent_name='人物', 
    #                 seeds=['蔡阿嘎','館長','滴妹','千千','狠愛演', 'How Fun'], 
    #                 terms=['蔡阿嘎','館長','滴妹','千千','狠愛演', 'How Fun', '阿滴', '木曜', '好味小姐'])
    # insertCategory('演藝明星', False, 'bobosheep', parent_name='人物', 
    #                 seeds=['彭于晏','周渝民','林志玲','張鈞甯','林依晨'], 
    #                 terms=['彭于晏','周渝民','林志玲','張鈞甯','林依晨'])
    # insertCategory('政治人物', False, 'bobosheep', parent_name='人物', 
    #                 seeds=['蔡英文','韓國瑜','馬英九','宋楚瑜','陳水扁','陳菊'], 
    #                 terms=['蔡英文','韓國瑜','馬英九','宋楚瑜','陳水扁','陳菊'])
    # insertCategory('運動', True, 'bobosheep')
    # insertCategory('棒球', False, 'bobosheep', parent_name='運動', 
    #                 seeds=['投手','捕手','全壘打','三振','保送'], 
    #                 terms=['投手','捕手','全壘打','三振','保送'])
    # insertCategory('旅遊與地理', True, 'bobosheep', child_mutex=True)
    # insertCategory('亞洲', False, 'bobosheep', parent_name='旅遊與地理')
    # insertCategory('台灣', False, 'bobosheep', parent_name='亞洲',
    #                 seeds=['嘉義','台中','台北','台東','高雄'],
    #                 terms=['嘉義','台中','台北','台東','高雄'])
    # insertCategory('日本', False, 'bobosheep', parent_name='亞洲',
    #                 seeds=['東京','晴空塔','北海道','名古屋','神奈川'],
    #                 terms=['東京','晴空塔','北海道','名古屋','神奈川'])
    # insertCategory('歐洲', False, 'bobosheep', parent_name='旅遊與地理',
    #                 seeds=['法國','德國','奧地利','瑞士','瑞典'],
    #                 terms=['法國','德國','奧地利','瑞士','瑞典'])

    # insertCategory('音樂', True, 'bobosheep')

    # insertCatFromDir('C:/Users/user/Documents/Project/NLP/Category/Classes')

    # insertTerm('生活', 'bobosheep')
    # insertTerm('新聞', 'bobosheep', frequency=224210)

    insertTermFile('new_word_detect/dic.fq1.txt')