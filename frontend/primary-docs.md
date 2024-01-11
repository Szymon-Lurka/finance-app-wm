# /api/v1/auth/register

## body:

```typescript
    username: string; <- unique
    password: string; <- min. 8 chars, 1 symbol, 1 number, 1big char
    email: string; <- valid email, unique
    lastName: string;
    firstName: string;
```

# /api/v1/auth/login

## body:

```typescript
username <- optional
email <- optional, must be email or login
password
```

# /api/v1/auth/refresh-token

## body:

```typescript
refreshToken;
```

# /api/v1/auth/forgot-password

## body:

```typescript
email;
```

## Reset password frontend URL -> DOMAIN/reset-password/:TOKEN

# /api/v1/auth/reset-password

```typescript
token <- obtained from email, should be in the URL
newPassword <- like regular password
```
