let api = new (require('./APi'))
api.admin().messaging().send(
{
    token:'czxKUXYCrGfExOrSN3vSL-:APA91bFKTOEF5BXS2JhZeY1vip6kxa0L6R56ORnQ2Woj99lqh7yOsNDQm5KYYrHyIpXV-LYXwvv_XYmxnnyGK5vAaUilN0PRLnEYtWlMlprugsx3cfWEXTBg4ZnFpG4JpffGtsIWInKP',
    data:{
        name:'asdas',
        dsa:'dsadsa'
    }
}).then((e)=>{
    console.log(e);
})