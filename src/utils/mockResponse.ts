class MockResponse {
    statusCode: number = 200;
    body: any;
    status(code: number) {
        this.statusCode = code;
        return this;
    }
    send(body: any) {
        this.body = body;
    }
}