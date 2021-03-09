import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextPack, Word,Wordlist } from './contextpack';
import { ContextPackService } from './contextpack.service';

describe('Context Pack service: ', () => {
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
  const wordList: Wordlist[] = [
    {
    nouns: testNouns,
    verbs: testVerbs,
    adjectives: testAdjectives,
    misc: testMisc
    }

  ];

  const testContextPacks: ContextPack[] = [
    {
      _id: 'chris_id',
      enabled: true,
      name: 'fun',
      wordlist: wordList
    },
    {
      _id: 'pat_id',
      enabled: false,
      name: 'happy',
      wordlist: wordList
    },
    {
      _id: 'jamie_id',
      enabled: true,
      name: 'sun',
      wordlist: wordList
    }
  ];
  let contextpackService: ContextPackService;
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
    contextpackService = new ContextPackService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getContextPack() calls api/contextpacks', () => {
    // Assert that the wordlists we get from this call to getWordlists()
    // should be our set of test wordlists. Because we're subscribing
    // to the result of getWordlists(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testWordlists) a few lines
    // down.
    contextpackService.getContextPack().subscribe(
      contextpack => expect(contextpack).toBe(testContextPacks)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(contextpackService.contextpackUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testContextPacks);
  });

  it('getContextPacktById() calls api/contextpacks/id', () => {
    const targetContextPack: ContextPack = testContextPacks[1];
    const targetId: string = targetContextPack._id;
    contextpackService.getContextPackById(targetId).subscribe(
      contextpack => expect(contextpack).toBe(targetContextPack)
    );

    const expectedUrl: string = contextpackService.contextpackUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetContextPack);
  });

  it('filterContextPack() filters by name', () => {
    expect(testContextPacks.length).toBe(3);
    const contextpackTopic = 'u';
    expect(contextpackService.filterContextPack(testContextPacks, { name: contextpackTopic }).length).toBe(2);
  });
});

