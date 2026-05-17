import re
path = '/Users/macbookprocecile/Documents/evidence/evidence-home-staging/backend/routes/ai.js'
with open(path, 'r') as f:
    c = f.read()
c = c.replace('\u005baxios.post\u005d(http://axios.post)', 'axios.post')
c = c.replace('\u005bresponse.data\u005d(http://response.data)', 'response.data')
c = c.replace('\u005bpoll.data\u005d(http://poll.data)', 'poll.data')
c = c.replace('\u005bcloudRes.data\u005d(http://cloudRes.data)', 'cloudRes.data')
with open(path, 'w') as f:
    f.write(c)
print('OK - done')