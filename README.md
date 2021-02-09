# GENERATE SELF SIGNED CERTIFICATE


```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
* ref https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/

./node_modules/http-server/bin/http-server . -c-1 -S --cert cert.pem --key key.pem

```

https://blog.anvileight.com/posts/simple-python-http-server/
python3 -m http.server -c cert.pem -k key.pem 


