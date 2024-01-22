<html>
<h2>Ticketing System</h2></html>
<blockquote>Hono + MongoDB + Node.js</blockquote>
<br/>

<h2>Requirements</h2>
<li><a href="https://account.mongodb.com/">MongoDB</a> - Database</li>
<li><a href="https://hono.dev/">Hono</a> - Server Framework</li>
<li><a href="https://nodejs.org/en">Node.js</a> - Server Environment</li>
<br/>

<h2>Deployment</h2>
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
<br/>

<h2>Running Development System</h2>

```
npm run dev
```
<br/>

<h2>Endpoints</h2>
<ul>
  <li><code>/register</code> : Metode POST - Untuk membuat akun</li>
  <li><code>/login</code> : Metode POST - Untuk mendapatkan token</li>
  <li><code>/tickets</code> : Metode GET - Untuk menampilkan data tickets</li>
  <li><code>/tickets</code> : Metode POST - Untuk membuat data baru untuk tickets</li>
  <li><code>/tickets/:id</code> : Metode PUT - Untuk mengubah status menjadi Closed</li>
  <li><code>/tickets/:id</code> : Metode DELETE - Untuk menghapus data tickets</li>
  <li><code>/tickets/answered</code> : Metode POST - Untuk membalas message pada tickets</li>
  <li><code>/tickets/answered</code> : Metode GET - Untuk melihat data balasan</li>
</ul><br/>

<h2>Membuat akun melalui POSTMAN</h2>
<ul>
  <li>Buat Collection Rest API</li>
  <li>Masukkan link URL</li>
 
  ```
 localhost:3000/register
  ```
  <li>Gunakan Metode POST</li>
  <li>Pilih Body, lalu masukkan data JSON seperti berikut : </li>

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


 

