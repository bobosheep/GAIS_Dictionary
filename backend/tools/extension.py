import os
from gensim.models import word2vec
from gensim import models

pwd = os.getcwd()
modelDcard = pwd + "/word2vec/models/dcard_300d.model" 
modelWiki = pwd + "/word2vec/models/news_wiki.model"

wiki_model = models.Word2Vec.load(modelWiki)
dcard_model = models.Word2Vec.load(modelDcard)
models = {
    'wiki_news': wiki_model,
    'dcard': dcard_model
}

def similarWord(word, n_results=10, model='wiki_news', with_similarity=False):
    res = []
    if word not in models[model].wv.vocab:
        return res
    words = models[model].most_similar(word, topn=n_results)
    for i in words:
        if with_similarity:
            res.append(i)
        else:
            res.append(i[0])
    return res

    
def checkSimilarity(w1, w2, model='wiki_news'):
    return models[model].similarity(w1, w2)

def extend(words, model='wiki_news', threshold=0.5, n_results=10):
    res = []
    for word in words:
        sWords = similarWord(word, n_results=n_results, model=model, with_similarity=True)
        sWords = filter(lambda  x: x if x[1] >= threshold  else None , sWords)
        res += [w[0] for w in sWords]
    
    res = list(set(res))
    return res


def checkCoverage(basis, covers):
    hashBasis = {}
    for k in basis:
        hashBasis[k] = k
    point = 0
    total = len(covers)
    for word in covers:
        if word in hashBasis:
            point += 1
    score = point / total
    return score