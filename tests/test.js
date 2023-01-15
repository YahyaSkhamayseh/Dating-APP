const request = require('request');
const comment = require('../routes/comment');
const API_URL_PREFIX = 'http://localhost:3000/';

const COMMENT_API_URL = API_URL_PREFIX + 'comment';
const LIKE_API_URL = API_URL_PREFIX + 'toggle-like';
const USER_ACCOUNT_API_URL = API_URL_PREFIX + 'user-account';
const PROFILE_API_URL = API_URL_PREFIX + 'profile';

const SAMPLE_PROFILE_PAYLOAD = {
    "profile": {
        "name": "A Martindssez",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "variant": "sp/so",
        "tritype": 725,
        "socionics": "SEE",
        "sloan": "RCOEN",
        "psyche": "FEVL",
        "image": "https://soulverse.boo.world/images/1.png"
    }
}

describe('Get profile with invalid id', () => {
    const PROFILE_ID = 'fdsf323'; // invalid because it's length is not 24
    test('It should return a 400 in response body, because this is invalid profile id', (done) => {
        const options = {
            method: 'GET',
            url: PROFILE_API_URL + '/' + PROFILE_ID,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        request.get(options, (error, response, body) => {
            expect(response.body.status).toBe(400);
            done();
        });
    });
});

describe('Create profile', () => {
    
    test('It should return a 200 in response body', (done) => {
        
        const options = {
            method: 'POST',
            url: PROFILE_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: SAMPLE_PROFILE_PAYLOAD,
            json: true
        };

        request.post(options, (error, response, body) => {
            expect(response.body.status).toBe(200);
            done();
        });
    });
});

describe('Get profile with valid id', () => {
    test('It should return a 200 in response', (done) => {

        const options = {
            method: 'POST',
            url: PROFILE_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: SAMPLE_PROFILE_PAYLOAD,
            json: true
        };

        request.post(options, (error, response, body) => {
            prfileId = response.body.data.profile._id;

            const options = {
                method: 'GET',
                url: PROFILE_API_URL + '/' + prfileId,
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true
            };
            request.get(options, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});


const SAMPLE_USER_ACCOUNT_PAYLOAD = {
    "userAccount": {
        "name": "Yahya Khamayseh"
    }
}

describe('Create user account', () => {
    
    test('It should return a 200 in response body', (done) => {
        
        const options = {
            method: 'POST',
            url: USER_ACCOUNT_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: SAMPLE_USER_ACCOUNT_PAYLOAD,
            json: true
        };

        request.post(options, (error, response, body) => {
            expect(response.body.status).toBe(200);
            done();
        });
    });
});

const SAMPLE_COMMENT_PAYLOAD = {
    "comment": {
        "personalityType": {
            "MBTI": "INFP",
            "Enneagram": "1w2",
            "Zodiac": "Aries"
        },
        "title": "title1",
        "description": "description1"
    }
}

describe('Create comment', () => {
    
    test('It should return a 200 in response body', (done) => {
        
        const options = {
            method: 'POST',
            url: COMMENT_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: SAMPLE_COMMENT_PAYLOAD,
            json: true
        };

        request.post(options, (error, response, body) => {
            expect(response.body.status).toBe(200);
            done();
        });
    });
});

const SAMPLE_COMMENT_PAYLOAD2 = [{
    "comment": {
        "personalityType": {
            "MBTI": "INFP"
        },
        "title": "title1",
        "description": "description1",
        "totalLikes": 3
    }
},
{
    "comment": {
        "personalityType": {
            "Enneagram": "1w2"
        },
        "title": "title1",
        "description": "description1",
        "totalLikes": 2
    }
},
{
    "comment": {
        "personalityType": {
            "Zodiac": "Aries"
        },
        "title": "title1",
        "description": "description1",
        "totalLikes": 4
    }
}]

describe('Filter & Sort comments', () => {
    
    test('Create multiple comments: It should return a 200 in response body', (done) => {

        // create multiple comments

        for (let samplePayload of SAMPLE_COMMENT_PAYLOAD2){
            const postOptions = {
                method: 'POST',
                url: COMMENT_API_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: samplePayload,
                json: true
            };
    
            request.post(postOptions, (error, response, body) => {
                expect(response.body.status).toBe(200);
                done();
            });
        }
    });

    test('Test recent sort: It should return sorted by recent comments array in response body', (done) => {

        // test recent sort
        const sortRecentOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=MBTI&sort=recent',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortRecentOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            expect(comments).toEqual(expectedComments);
            done();
        });
    });

    test('Test best sort: It should return sorted by best comments array in response body', (done) => {

        // test best sort
        const sortBestOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=MBTI&sort=best',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortBestOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.sort((a,b) => b.totalLikes - a.totalLikes);
            expect(comments).toEqual(expectedComments);
            done();
        });
    });

    test('Test filter by MBTI: It should return filtered by MBTI comments array in response body', (done) => {

        // test filter by MBTI
        const sortBestOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=MBTI&sort=recent',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortBestOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.filter((comment) => comment.personalityType.MBTI !==null);
            expect(comments).toEqual(expectedComments);
            done();
        });
    });

    test('Test filter by Enneagram: It should return filtered by Enneagram comments array in response body', (done) => {

        // test filter by Enneagram
        const sortBestOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=Enneagram&sort=recent',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortBestOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.filter((comment) => comment.personalityType.Enneagram !==null);
            expect(comments).toEqual(expectedComments);
            done();
        });
    });

    test('Test filter by Zodiac: It should return filtered by Zodiac comments array in response body', (done) => {

        // test filter by Zodiac
        const sortBestOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=Zodiac&sort=recent',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortBestOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.filter((comment) => comment.personalityType.Zodiac !==null);
            expect(comments).toEqual(expectedComments);
            done();
        });
    });
    
    test('Test filter by all: It should return filtered by all comments array in response body', (done) => {

        // test filter by all
        const sortBestOptions = {
            method: 'GET',
            url: COMMENT_API_URL + '?filter=all&sort=recent',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.get(sortBestOptions, (error, response, body) => {
            expect(response.body.status).toBe(200);
            const comments =  response.body.data;
            const expectedComments = [...comments];
            expectedComments.filter((comment) => comment.personalityType !==null);
            expect(comments).toEqual(expectedComments);
            done();
        });
    });
});


describe('Toggle like', () => {

    test('It should return a 200 in response body', (done) => {
 
        const options = {
            method: 'POST',
            url: USER_ACCOUNT_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: SAMPLE_USER_ACCOUNT_PAYLOAD,
            json: true
        };

        request.post(options, (error, response, body) => {
            expect(response.body.status).toBe(200);
            userAccountId = response.body.data.userAccount._id;

            const options = {
                method: 'POST',
                url: COMMENT_API_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: SAMPLE_COMMENT_PAYLOAD,
                json: true
            };
    
            request.post(options, (error, response, body) => {
                expect(response.body.status).toBe(200);
                commentId = response.body.data.comment._id;

                const options = {
                    method: 'POST',
                    url: LIKE_API_URL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        "like": {
                            "userAccountId": userAccountId,
                            "commentId": commentId
                        }
                    },
                    json: true
                };
        
                request.post(options, (error, response, body) => {
                    expect(response.body.status).toBe(200);
                    done();
                });
            });
        });
    });
});