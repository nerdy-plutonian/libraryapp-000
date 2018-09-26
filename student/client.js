var swRegistration;
const publicKey = 'BFZxKYazb3F1HdLLMoQiN91NjFPrQpb1efz_fnK2_aCj69HMRZk0o4L8FfTAs973Onv3_Ww8imakZF2ZEPyrRSo';
var sub_button = document.getElementById("sub_btn");
var isSubbed;

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
  
    navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);
      swRegistration = swReg;
      initializeUI();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
  } else {
    console.warn('Push messaging is not supported');
  }

  sub_button.addEventListener('click',function(){
    if (Notification.permission === "granted") {
        if(isSubbed){
            unsubscribeUser();
        }else{
            subUser();
        }
        } else if (Notification.permission === "denied") {
        console.log("Can't show notification");
        } else if (Notification.permission === "default") {
        Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            if(isSubbed){
                unsubscribeUser();
            }else{
                subUser();
            }
        } else if (Notification.permission === "denied") {
        console.log("Can't show notification");
        } else if (Notification.permission === "default") {
        console.log("Can't show notification, but can ask for permission again.");
        }
        });
        }
  });

  async function subUser() {
    //register sub
    console.log('registering sub');
    const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    }) ;
    if(subscription !== null){
        console.log('sub registered...');
        console.log(JSON.stringify(subscription));
        sub_button.innerHTML = 'subscribed';
        isSubbed = true;
        const subJSON = JSON.stringify(subscription);
        //window.location.href = "../admin/push_notif.php?sub=" + subJSON;
        updateSubscriptionOnServer(subJSON);
    }else{
        console.log('sub failed to register...');
        sub_button.innerHTML = 'subscribe';
        isSubbed = false;
    }
}

function initializeUI() {
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      isSubbed = !(subscription === null);
      
      if (isSubbed) {
        console.log('User IS subscribed.');
        console.log(subscription);
        sub_button.innerHTML = 'subscribed';
      } else {
        console.log('User is NOT subscribed.');
        sub_button.innerHTML = 'subscribe';
        isSubbed = false;
      }
    });
  }

  function unsubscribeUser(){
    swRegistration.pushManager.getSubscription().then(function(subscription) {
      subscription.unsubscribe().then(function(successful) {
        console.log('Youve successfully unsubscribed');
        sub_button.innerHTML = 'subscribe';
        isSubbed = false;
      }).catch(function(e) {
        console.log('Couldnt unsubscribe');
      })
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function updateSubscriptionOnServer(subJSON){
    //window.location.href = "../admin/push_notif.php?sub=" + subJSON;
    
        $.ajax({
            type: 'POST',
            url: '../admin/add_sub.php',
            data: { newSub: subJSON },
            success: function(response) {
                window.alert(response);
            }
        });
        
  }
