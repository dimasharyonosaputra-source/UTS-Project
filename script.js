
document.addEventListener('DOMContentLoaded', function() {
    
    const tombol = document.getElementById('btn-pesan');
    const teksRespon = document.getElementById('respon-teks');

    tombol.addEventListener('click', function() {
       
        teksRespon.innerText = "Apabila sesuatu yang kau senangi tidak terjadi, maka senangilah apa yang terjadi.";
        teksRespon.style.color = "blue";
        teksRespon.style.fontWeight = "bold";
    });

});