import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextPack, Word, Wordlist } from './contextpack';
import { ContextPackService } from './contextpack.service';

describe('Context Pack service: ', () => {
  // A small collection of test contextpacks
  const noun: Word = {
    word: 'you',
    forms: ['you', 'yos']
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
  const testWordlist: Wordlist[] =[
    {
      name: 'happy',
      enabled: false,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    }
    ];

  const testContextPacks: ContextPack[] =
    [
      {
        _id: 'chris_id',
        name: 'fun',
        enabled: true,
        wordlists: testWordlist
      },
      {
        _id: 'pat_id',
        name: 'sun',
        enabled: true,
        wordlists: testWordlist
      },
      {
        _id: 'jamie_id',
        name: 'happy',
        enabled: true,
        wordlists: testWordlist
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
    // Assert that the contextpacks we get from this call to getContextPacks()
    // should be our set of test contextpacks. Because we're subscribing
    // to the result of getContextPacks(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testContextPacks) a few lines
    // down.
    contextpackService.getContextPacks().subscribe(
      contextpacks => expect(contextpacks).toBe(testContextPacks)
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

  it('getContextPackById() calls api/contextpacks/id', () => {
    const targetContextPack: ContextPack = testContextPacks[0];
    const targetId: string = targetContextPack._id;
    contextpackService.getContextPackById(targetId).subscribe(
      contextpack => expect(contextpack).toBe(targetContextPack)
    );

    const expectedUrl: string = contextpackService.contextpackUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetContextPack);
  });
  it('should check some strings with admin checker', () => {
    expect(contextpackService.checkIfAdmin('true')).toEqual(true);
  });
  it('should check some strings with login checker', () => {
    expect(contextpackService.checkIfLoggedIn('true')).toEqual(true);
  });

  it('filterContextPack() filters by name', () => {
    expect(testContextPacks.length).toBe(3);
    const contextpackName = 'fun';
    expect(contextpackService.filterContextPacks(testContextPacks, { name: contextpackName }).length).toBe(1);
  });

  it('addContextpack() posts to api/contextpacks', () => {

    contextpackService.addContextPack(testContextPacks[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(contextpackService.contextpackUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testContextPacks[1]);

    req.flush({id: 'testid'});
  });

  it('updateContextPack() posts to api/contextpack/:id/editpack', () => {

    contextpackService.updateContextPack(testContextPacks[1], {name: 'Birthday'}).subscribe(
      contextPack => expect(contextPack.name).toBe('Birthday')
    );

    const req = httpTestingController.expectOne(contextpackService.contextpackUrl+'/'+testContextPacks[1]._id+'/editpack?name=Birthday');

    expect(req.request.method).toEqual('POST');

  });
  describe('Editing Contextpack information', ()=>{
    it('Edits the naem of a contextpack', () => {
      contextpackService.updateContextPack(testContextPacks[0], { name: 'cows', enabled:'true', icon:'icon.png'}).subscribe(
        contextPack => expect(contextPack.wordlists[0].nouns[0].forms));

      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editpack?name=cows&enabled=true&icon=icon.png');
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('Editing wordlist information', ()=>{
    it('Updates the name and status of the wordlist', () => {
      contextpackService.updateWordList(testContextPacks[0], testContextPacks[0].wordlists[0].name,
         { name: 'Sad', enabled:'true' }).subscribe(contextPack => expect);

      const req = httpTestingController.expectOne(contextpackService.contextpackUrl+'/'+testContextPacks[0]._id+
      '/editlist?listname=happy&name=Sad&enabled=true');

      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Adding Words to a wordlist', ()=>{
    it('Add a noun posts to the correct url', () => {
      contextpackService.addWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {noun: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].nouns[0].forms).toContain('teachers'));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&addnoun=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Add a noun wtih forms posts to the correct url', () => {
      contextpackService.addWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {noun: 'teachers,teach'}
      ).subscribe(contextPack => expect(contextPack.wordlists[0].nouns[0].forms).toContain('teachers'));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&addnoun=teachers,teach');
      expect(req.request.method).toEqual('POST');
    });
    it('Add a verb posts to the correct url', () => {
      contextpackService.addWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {verb: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].verbs[0].forms).toContain('teachers'));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&addverb=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Add a misc posts to the correct url', () => {
      contextpackService.addWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {misc: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].misc[0].forms).toContain('teachers'));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&addmisc=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Add a adjectives posts to the correct url', () => {
      contextpackService.addWord(testContextPacks[0], testContextPacks[0].wordlists[0].name,{adjective: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].adjectives[0].forms).toContain('teachers'));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&addadj=teachers');
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Deleting Words from a wordlist', ()=>{
    it('Deleting a noun posts to the correct url', () => {
      console.log(testContextPacks[0].wordlists[0].name);
      contextpackService.deleteWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {noun: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].nouns[0].word));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&delnoun=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Deleting a verb posts to the correct url', () => {
      contextpackService.deleteWord(testContextPacks[0], testContextPacks[0].wordlists[0].name,{verb: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].verbs[0].forms));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&delverb=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Deleting a misc posts to the correct url', () => {
      contextpackService.deleteWord(testContextPacks[0], testContextPacks[0].wordlists[0].name, {misc: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].misc[0].forms));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&delmisc=teachers');
      expect(req.request.method).toEqual('POST');
    });
    it('Deleting a adj posts to the correct url', () => {
      contextpackService.deleteWord(testContextPacks[0], testContextPacks[0].wordlists[0].name,{adjective: 'teachers'})
      .subscribe(contextPack => expect(contextPack.wordlists[0].adjectives[0].forms));
      const req = httpTestingController.expectOne('/api/contextpacks/chris_id/editlist?listname=happy&deladj=teachers');
      expect(req.request.method).toEqual('POST');
    });
  });

});

