describe('Auth', () => {
  it('create user login, используется', async () => {
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/User', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'},
      body: JSON.stringify({
        "userName": 'user',
        "password": 'Qwerty123!@',
      }),
    })
    const data = await response.json()

    expect(response.status).toEqual(406);
    expect(data.message).toEqual('User exists!');
  })
  it('create user, password failed', async () => {
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/User', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'},
      body: JSON.stringify({
        "userName": 'user1',
        "password": 'Q',
      }),
    })
    const data = await response.json()

    expect(response.status).toEqual(400);
    expect(data.message).toEqual("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer."
  );
  })
  it('create user, success', async () => {
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/User', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'},
      body: JSON.stringify({
        "userName": 'user123',
        "password": 'Qwerty1234!@122',
      }),
    })
    const data = await response.json()
    expect(response.status).toEqual(201);
  })
})

describe('Token', () => {
  it('GenerateToken', async () => {
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/GenerateToken', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'},
      body: JSON.stringify({
        "userName": 'user',
        "password": 'Qwerty123!@',
      }),
    })
    const data = await response.json()

    expect(response.status).toEqual(200);
    expect(data.token).toBeTruthy();
  })
  it('GenerateToken error', async () => {
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/GenerateToken', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'},
      body: JSON.stringify({
        "userName": 'user',
        "password": 'q',
      }),
    })
    const data = await response.json()

    expect(response.status).toEqual(200);
    expect(data.token).not.toBeTruthy();
    expect(data.result).toEqual('User authorization failed.');
  })
})
