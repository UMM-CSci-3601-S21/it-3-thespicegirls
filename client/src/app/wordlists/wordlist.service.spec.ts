import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Wordlist, Word } from './wordlist';
import { WordlistService } from './wordlist.service';

describe('Wordlist service: ', () => {
  // A small collection of test wordlists
  const noun: Word = {
    word: 'you',
    forms: ['you', 'yos', 'yoted']
  };
  const adjective: Word = {
    word: 'green',
    forms: ['green', 'greener']
  };
  const verb: Word = {
    word: 'ran',
    forms: ['ran', 'running']
  };
  const misc: Word = {
    word: 'langerhans',
    forms: ['langerhans']
  };
  const testNouns: Word[] = [noun];
  const testVerbs: Word[] = [verb];
  const testAdjectives: Word[] = [adjective];
  const testMisc: Word[] = [misc];

  const testWordlists: Wordlist[] = [
    {
      _id: 'chris_id',
      enabled: true,
      topic: 'fun',
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    },
    {
      _id: 'pat_id',
      enabled: false,
      topic: 'happy',
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    },
    {
      _id: 'jamie_id',
      enabled: true,
      topic: 'sun',
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    }
  ];
  let wordlistService: WordlistService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    wordlistService = new WordlistService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getWordlists() calls api/wordlists', () => {
    // Assert that the wordlists we get from this call to getWordlists()
    // should be our set of test wordlists. Because we're subscribing
    // to the result of getWordlists(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testWordlists) a few lines
    // down.
    wordlistService.getWordlists().subscribe(
      wordlists => expect(wordlists).toBe(testWordlists)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(wordlistService.wordlistUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testWordlists);
  });

  it('getWordlistById() calls api/wordlists/id', () => {
    const targetWordlist: Wordlist = testWordlists[1];
    const targetId: string = targetWordlist._id;
    wordlistService.getWordlistById(targetId).subscribe(
      wordlist => expect(wordlist).toBe(targetWordlist)
    );

    const expectedUrl: string = wordlistService.wordlistUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetWordlist);
  });

  it('filterWordlists() filters by topic', () => {
    expect(testWordlists.length).toBe(3);
    const wordlistTopic = 'u';
    expect(wordlistService.filterWordlists(testWordlists, { topic: wordlistTopic }).length).toBe(2);
  });

  it('addWordlist() posts to api/wordlists', () => {

    wordlistService.addWordlist(testWordlists[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(wordlistService.wordlistUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testWordlists[1]);

    req.flush({id: 'testid'});
  });

});

