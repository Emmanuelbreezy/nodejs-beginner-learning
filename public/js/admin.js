const delectProduct = (btn) => {
   const proId = btn.parentNode.querySelector('[name=productId]').value;
   const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  
   const productEle = btn.parentNode.parentNode.parentNode.parentNode.parentNode;
   console.log(productEle,'=====')

   fetch('/admin/delete-product/' + proId, {
       method: 'DELETE',
       headers: {
           'csrf-token': csrf
       }
   }).then(result => {
       return result.json();
   })
   .then(data => {
    productEle.parentNode.removeChild(productEle);
   })
   .catch(err => {
       console.log(err);
   })
}

