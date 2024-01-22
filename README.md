<html>
<h3>Ticketing System</h3></html>
<hr/>
<blockquote>Hono + MongoDB + Node.js</blockquote>

<h3>Requirements</h3>
<hr/>
<li><a href="https://account.mongodb.com/">MongoDB</a> - Database</li>
<li><a href="https://hono.dev/">Hono</a> - Server Framework</li>
<li><a href="https://nodejs.org/en">Node.js</a> - Server Environment</li>

<h3>Deployment</h3>
<hr/>
Buat folder baru untuk menyimpan projectnya, lalu clone repositorynya
<blockquote>Folder harus kosong!</blockquote>

```
git clone https://github.com/Opalrsln/ticket-sederhana.git
```

Lalu masuk ke folder yang sudah di clone

```
cd ticket-sederhana
npm install
```

<h3>Running Development System</h3>
<hr/>

```
npm run dev
```

<h3>Endpoint</h3>
<hr/>
<ul>
  <li><code>/register</code> : Metode POST - Untuk membuat akun</li>
  <li><code>/login</code> : Metode POST - Untuk mendapatkan token</li>
  <li><code>/tickets</code> : Metode GET - Untuk menampilkan data tickets</li>
  <li><code>/tickets</code> : Metode POST - Untuk membuat data baru untuk tickets</li>
  <li><code>/tickets/:id</code> : Metode PUT - Untuk mengubah status menjadi Closed</li>
  <li><code>/tickets/:id</code> : Metode DELETE - Untuk menghapus data tickets</li>
  <li><code>/tickets/answered</code> : Metode POST - Untuk membalas message pada tickets</li>
  <li><code>/tickets/answered</code> : Metode GET - Untuk melihat data balasan</li>
</ul>

<h3>Membuat akun melalui POSTMAN</h3>
<ul>
  <ol>Buat Collection Rest API</ol>
  <ol>Masukkan link URL</ol>
 
  ```
 localhost:3000/register
  ```
  <ol>Gunakan Metode POST</ol>
  <ol>Pilih Body, lalu masukkan data JSON seperti berikut : </ol>

  ```
{
  "username": "user",
  "email": "user123@example.com",
  "password": "user123456",
  "address": "Washington C12",
  "phonenumber": "1234567"
}
  ```


</ul>


 

