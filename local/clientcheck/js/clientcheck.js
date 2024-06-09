/*
Simulate errors by specifiying these parameters in the url:
js=1
pdf=1
cookie=1
youtube=1
vimeo=1
browser=1
*/
var noOfTests = 10;
var noOfTestFailed = 0;
var noOfTestSucceeded = 0;
var testDelayMs = 200;
var minimumSpeedRequirement = 2.0;
var imageAddr = "img/speed.png"; 
var downloadSize = 9002806; //bytes
var minimumGhz = 4.0;
var allowedMinFpsValue = 40;
var iTestCpuSpeedAmount = 9000000;
var sceneIntervalId = null;
var urlParamsObj = null;

jQuery(function($) {
    urlParamsObj = urlParamsToObject();
    $(".clientcheck_ny_test").click(performTests);
    performTests();
});    

function performTests()
{
    $("#client_check_javascript_test").show();
    $(".client_check_result_area").show();
    $(".maskintest_status").hide();
    $("#client_check_other_tests").html("");
    updateMainResult('<span class="loading">Tester maskinen</span>');

    noOfTestFailed = 0;
    noOfTestSucceeded = 0;
    testJavascript();
    setTimeout(function() {
        testCookies();
        setTimeout(function() {
            testBrowser();
            setTimeout(function() {
                testPdfPlugin();
                setTimeout(function() {
                    testYoutube();
                    setTimeout(function() {
                        testVimeo();
                        setTimeout(function() {
                            testSpeed();
                            setTimeout(function() {
                                testDeviceType();
                                setTimeout(function() {
                                    testGpu();
                                    setTimeout(function() {
                                        testPerformance();
                                    }, testDelayMs)
                                }, testDelayMs)
                            }, testDelayMs)
                        }, testDelayMs)
                    }, testDelayMs)
                }, testDelayMs)
            }, testDelayMs)
        }, testDelayMs)
    }, testDelayMs)
}

function updateMainResult(msg) {
    $("#clientcheck_main_result").html(msg);
}

function checkTestResults() {
    if(noOfTestFailed + noOfTestSucceeded < noOfTests)
    {
        return;
    }
    $(".client_check_result_area").show();
    $(".maskintest_status").show();
    
    if(noOfTestFailed) {
        $(window).scrollTop(0);
        updateMainResult("Ooops - maskinen din er ikke klar for for å bruke digilær.no")
        $("#clientcheck_info").html("Før du kan ta i bruk digilær.no må du gjøre følgende:");
        $(".maskintest_status").html("Kontakt lokal IT-support dersom du ikke klarer å løse punktene du får beskjed om ovenfor.");
        if(noOfTestSucceeded) {
            $("#clientcheck_success_info").html("Punktene nedenfor er i orden:");
        }
    } else {
//        $(".client_check_tests").html("");        
        $(".clientcheck_ny_test").hide();
        updateMainResult("Topp - maskinen din er klar for til å ta i bruk digilær.no")
        $(".maskintest_status").html("Maskinen din og internettforbindelsen har den nødvendige kapasiteten for å delta på digilær.no, vi anbefaler at datamaskinen er kablet til internett. Vær oppmerksom på at dette er en øyeblikkstest. Det betyr at dersom du for eksempel er på et trådløst nett og flytter maskinen, eller du bytter nett så vil resultatet kunne bli et annet.");
    }
    $(".maskintest_status").show();
}

function incrementTestFailed() {
    noOfTestFailed++;
    checkTestResults();
}
function decrementTestFailed()
{
    noOfTestFailed--;
    checkTestResults();
}
function incrementTestSucceded() {
    noOfTestSucceeded++;
    checkTestResults();
}

var testIntervalId;
function testStart(testName) {
    const markup = `
    <div id="currentTest" class="clientcheck_success_test">
        <ul class="fa-ul">
        <li>
            <span id="currentTestProgress" class="clientcheck_success_test_heading">${testName}</span>
        </li>
        </ul> 
    </div>
`;
    $("#client_check_success_tests").append(markup);
    testIntervalId = setInterval(function(){ 
        testProgress();
    }, 100);    
}
function testEnd() {
    $("#currentTest").remove();
    clearInterval(testIntervalId);
}
function testProgress() {
    $("#currentTestProgress").append("."); 
}

function testFailed(testId, testName, info, failure, action)
{
    const markup = `
    <div class="clientcheck_test">
        <ul id="${testId}" class="fa-ul">
        <li class="clientcheck_test_heading">
        ${testName}
        </li>
        <li>
            <span class="fa-li" ><i class="fas fa-info-circle"></i></span>
            <span class="clientcheck_test_info">
            ${info}
            </span>
        </li>
        <li>
            <span class="fa-li"><i class="fas fa-times-circle" style="color:#d0021b"></i></span>
            <span class="clientcheck_test_failure">
            ${failure}
            </span>
        </li>
        <li>
            <span class="fa-li"><i class="fas fa-arrow-circle-right" style="color:#439126"></i></span>
            <span class="clientcheck_test_action">
            ${action}
            </span>
        </li>
        </ul> 
    </div>
`;
    $("#client_check_other_tests").append(markup);
}
function testSucceeded(testId, testName, successMessage)
{
    const markup = `
    <div class="clientcheck_success_test">
        <ul id="${testId}" class="fa-ul">
        <li>
            <span class="fa-li" ><i class="far fa-check-circle" style="color:#439126"></i></span>
            <span class="clientcheck_success_test_heading">${testName}</span>
            <span class="clientcheck_test_success">
            - ${successMessage}
            </span>
        </li>
        </ul> 
    </div>
`;
    $("#client_check_success_tests").append(markup);
}


function manualTestMessage(event)
{
    if(!event.data.result) {
        $("#"+event.data.msgId).show();
        $("#"+event.data.msgId+"_content").html(event.data.msg);
        $("#"+event.data.testId+"_success").fadeTo( "slow" , 0.31);
        $("#"+event.data.testId+"_success").unbind();
        $("#"+event.data.testId+"_failure").unbind();
    } else {
        decrementTestFailed();
        incrementTestSucceded();
        $("#"+event.data.testId+"_failure").fadeTo( "slow" , 0.31);
        $("#"+event.data.testId+"_success").unbind();
        $("#"+event.data.testId+"_failure").unbind();
    }
}
function manualTest(parentTestId, testId, question, msgOnFailure)
{
    var msgId = testId + "_msg";
    const markup = `
    <div class="clientcheck_test">
        <ul class="fa-ul">
        <li class="clientcheck_separator_line">
        </li>
        <li>
            <span class="fa-li"><i class="fas fa-arrow-circle-right" style="color:#000000"></i></span>
            <span class="clientcheck_test_manual">
            ${question}
            <i id="${testId}_success" class="fas fa-check-circle" style="color:#439126"></i>
            <i id="${testId}_failure" class="fas fa-times-circle" style="color:#d0021b"></i>
            </span>
        </li>
        <li id="${testId}_msg" style="display:none">
            <span class="fa-li"><i class="fas fa-question-circle" style="color:#000000"></i></span>
            <span id="${msgId}_content" class="${msgId}_content"></span>
        </li>
        </ul> 
    </div>
`;     
    $("#"+parentTestId).after(markup);
    $("#"+testId+"_success").click({testId: testId, msgId: msgId, result:true}, manualTestMessage);
    $("#"+testId+"_failure").click({testId: testId, msgId: msgId, msg: msgOnFailure, result:false}, manualTestMessage);
}

/* Javascript må feile som default, dvs. at feilemeldingen ligger i html, og så
   slår vi den av i testen. Hvis testen klarer å kjøre så betyr det at javascript er slått på.
   */
function testJavascript()
{
    var javascriptTestId = "client_check_javascript_test";
    var success = "Javascript er slått på."
    var testName = "Javascript";
    if(simulateError("js"))
    {
        incrementTestFailed();
        return;
    }
    $("#"+javascriptTestId).hide();
    testSucceeded(client_check_javascript_test, testName, success);
    incrementTestSucceded(client_check_javascript_test);
}
function testPdfPlugin() {
    var pluginTestId = "clientcheck_pdf_plugin_test";
    var testName = "Pdf-leser";
    var info = "En PDF-leser er påkrevd for å se en del dokumenter.";
    var error = "PDF-leser er ikke installert i nettleseren.";
    var action = '<a href="empty.pdf">Klikk på lenken for å se om du kan åpne den i en ekstern PDF-leser.</a>';
    var success = "PDF-leser er installert i nettleseren.";

    var pdfPluginAvailable = false;

    if(! PluginDetect.getVersion('PDFReader', 'empty.pdf') >= 0 ) {
        pdfPluginAvailable = "true";
    }
    if(simulateError("pdf")) {
        var pdfPluginAvailable = false;
    }
    if(!pdfPluginAvailable) {
        incrementTestFailed();
        testFailed(pluginTestId, testName, info, error, action);
        var manualPdfTestId= "clientcheck_manual_pdf_test";
        var question = "Kunne du åpne dokumentet?";
        manualTest(pluginTestId, manualPdfTestId, question, "Kontakt lærer / IT-avdeling ved din skole.");
    } else {
        testSucceeded(pluginTestId, testName, success)
        incrementTestSucceded();
    }
}


function testCookies()
{
    var testName = "Cookies";
    var cookieTestId = "clientcheck_cookie_test";
    var info = "Cookies er påkrevd for noen av nettsidene som er knyttet til digilær.";
    var error = "Cookies er av.";
    var action = "Vennligst aktiver Cookies i din nettleser.";
    var success = "Cookies er aktivert.";

    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie="testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    if(simulateError("cookie")) {
        cookieEnabled = false;
    }
    if(!cookieEnabled) {
        incrementTestFailed();
        testFailed(cookieTestId, testName, info, error, action);
    } else {
        testSucceeded(cookieTestId, testName, success)
        incrementTestSucceded();
    }
}

/* Noen skoler har brannmur som hindrer elevene i å se filmer på youtube o.l. */
function testAvailability(testId, testName, info, error, success, site)
{
    var availabilityTestId = "clientcheck_" + testId + "_test";
    var action = '';
    var result = false;

    site.img = new Image();
    site.img.onload = function(){
        console.log(testName + " is available.");
        testSucceeded(availabilityTestId, testName, success)
        incrementTestSucceded();
    };
    site.img.onerror = function() {
        incrementTestFailed();
        action = "<a href=" + site.url + '" target="_blank">Klikk på lenken for å se om du kan åpne ' + site.name + " manuelt.</a>"
        testFailed(availabilityTestId, testName, info, error, action);
        var manualTestId= "clientcheck_manual_"+testId+"_test";
        var question = "Kunne du åpne lenken?";
        manualTest(availabilityTestId, manualTestId, question, "Kontakt lærer / IT-avdeling ved din skole.");
    };
    site.img.src = site.test;
}

function testYoutube()
{
    var testId = "youtube";
    var testName = "YouTube";
    var info = "Du må kunne spille av video på YouTube.";
    var error = "YouTube kunne ikke nås.";
    var success = "YouTube kan nås.";

    var site = new Object();
    site.name = 'Youtube';
    site.url = 'https://www.youtube.com';
    site.test ='https://www.youtube.com/favicon.ico';
    if(simulateError("youtube")){
        site.test="blah";
    }
    testAvailability(testId, testName, info, error, success, site)
}

function testVimeo()
{
    var testId = "vimeo";
    var testName = "Vimeo";
    var info = "Du må kunne spille av video på Vimeo.";
    var error = "Vimeo kunne ikke nås.";
    var success = "Vimeo kan nås.";

    var site = new Object();
    site.name = 'Vimeo';
    site.url = 'https://vimeo.com';
    site.test ='https://f.vimeocdn.com/images_v6/favicon.ico';
    if(simulateError("vimeo")){
        site.test="blah";
    }
    testAvailability(testId, testName, info, error, success, site)
}

function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function isMobileTablet(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
//https://medium.com/simplejs/detect-the-users-device-type-with-a-simple-javascript-check-4fc656b735e1
function testDeviceType() {
    var testName = "Enhet";
    var speedTestId = "clientcheck_device_test";
    var info = "God skjermstørrelse er viktig.";
    var error = "";
    var action = "";
    var success = "Du har god skjermstørrelse."
    var smallScreenSize = false;

    if(isMobile()) {
        error = "Det ser ut til at du bruker en mobiltelefon.";
        action = "For å få best utbytte av digilær.no bør du bruke en enhet med større skjerm.";
        var smallScreenSize = true;
    } else if (isMobileTablet()) {
        error = "Det ser ut til at du bruker en tablet.";
        action = "For å få best utbytte av digilær.no bør du bruke en enhet med større skjerm.";
        var smallScreenSize = true;
    } 
    if(smallScreenSize) {
        incrementTestFailed();
        testFailed(speedTestId, testName, info, error, action);
    } else {
        testSucceeded(speedTestId, testName, success);
        incrementTestSucceded();
    }
}

var iTestCpuSpeed = 0;
var spdGhz = 0;

var stopGpuTest = false;

var gpuIteration = 0;
var sun = new Image();
var moon = new Image();
var earth = new Image();
function testPerformance() {
    // set FPS calulation based in the last 120 loop cicles 
    fps.sampleSize = 120;
    // start loop
    loop();

    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

    window.requestAnimationFrame(draw);
    window.requestAnimationFrame(clock);
    sceneIntervalId = startScene();
}





function startScene() {
    var img = new Image();

    // User Variables - customize these to change the image being scrolled, its
    // direction, and the speed.
    img.src = 'img/panorama.JPG';
    var CanvasXSize = 800;
    var CanvasYSize = 200;
    var speed = 1; // lower is faster
    var scale = 1.05;
    var y = -4.5; // vertical offset
    var dx = 0.75;
    var imgW;
    var imgH;
    var x = 0;
    var clearX;
    var clearY;
    var ctx;
    img.onload = function() {
        imgW = img.width * scale;
        imgH = img.height * scale;

        if (imgW > CanvasXSize) {
            // image larger than canvas
            x = CanvasXSize - imgW;
        }
        if (imgW > CanvasXSize) {
            // image width larger than canvas
            clearX = imgW;
        } else {
            clearX = CanvasXSize;
        }
        if (imgH > CanvasYSize) {
            // image height larger than canvas
            clearY = imgH;
        } else {
            clearY = CanvasYSize;
        }

        // get canvas context
        ctx = document.getElementById('scene').getContext('2d');

        // set refresh rate
        return setInterval(drawScene, speed);
    }
    function drawScene() {
        ctx.clearRect(0, 0, clearX, clearY); // clear the canvas

        // if image is <= Canvas Size
        if (imgW <= CanvasXSize) {
            // reset, start from beginning
            if (x > CanvasXSize) {
                x = -imgW + x;
            }
            // draw additional image1
            if (x > 0) {
                ctx.drawImage(img, -imgW + x, y, imgW, imgH);
            }
            // draw additional image2
            if (x - imgW > 0) {
                ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
            }
        }

        // image is > Canvas Size
        else {
            // reset, start from beginning
            if (x > (CanvasXSize)) {
                x = CanvasXSize - imgW;
            }
            // draw additional image
            if (x > (CanvasXSize-imgW)) {
                ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
            }
        }
        // draw image
        ctx.drawImage(img, x, y,imgW, imgH);
        // amount to move
        x += dx;
    }
}
// *******************
// test time...
// *******************

function loop(){
    var testName = "Ytelse";

    if(gpuIteration < 1)
    {
        testStart(testName);
    }
    gpuIteration++;
    let fpsValue = fps.tick();
    console.log("FPS:" + fpsValue);
    if(gpuIteration > fps.sampleSize) {
        var testId = "clientcheck_gpu_test";
        var info = "Videokonferanser krever en nettleser med god ytelse.";
        var error = "Din nettleser har lav ytelse: ";
        var action = "Dette kan skyldes at du har mange åpne faner eller andre programmer som belaster maskinen. \
        Avslutt programmer du ikke trenger og lukk unødvendige faner. Dersom det ikke hjelper kan du prøve en annen \
        nettleser. Ta kontakt med din IT-avdeling for ytterligere bistand.";
        var success = "Din maskin har god gjennomsnittlig ytelse: "

        if(simulateError("gpu"))
        {
            fpsValue = 11;
        }

        stopGpuTest = true;
        clearInterval(sceneIntervalId);
        testEnd();

        if(fpsValue < allowedMinFpsValue) {
            incrementTestFailed();
            testFailed(testId, testName, info, error + fpsValue, action);
        } else {
            testSucceeded(testId, testName, success + fpsValue);
            incrementTestSucceded();
        }
    } else {
        requestAnimationFrame( loop );
    }
}


//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations


function draw() {
  //Put some strain on CPU to see how this affects fps.
  testCpuSpeed();

  var ctx = document.getElementById('solarsystem').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, 300, 300); // clear canvas

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  ctx.save();
  ctx.translate(150, 150);

  // Earth
  var time = new Date();
  ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
  ctx.translate(105, 0);
  ctx.fillRect(0, -12, 40, 24); // Shadow
  ctx.drawImage(earth, -12, -12);

  // Moon
  ctx.save();
  ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
  ctx.translate(0, 28.5);
  ctx.drawImage(moon, -3.5, -3.5);
  ctx.restore();

  ctx.restore();

  ctx.beginPath();
  ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
  ctx.stroke();

  ctx.drawImage(sun, 0, 0, 300, 300);

  if(!stopGpuTest) {
      window.requestAnimationFrame(draw);
  }
}

function clock() {
  var now = new Date();
  var ctx = document.getElementById('clock').getContext('2d');
  ctx.save();
  ctx.clearRect(0, 0, 150, 150);
  ctx.translate(75, 75);
  ctx.scale(0.4, 0.4);
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  // Hour marks
  ctx.save();
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(100, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Minute marks
  ctx.save();
  ctx.lineWidth = 5;
  for (i = 0; i < 60; i++) {
    if (i % 5!= 0) {
      ctx.beginPath();
      ctx.moveTo(117, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr  = now.getHours();
  hr = hr >= 12 ? hr - 12 : hr;

  ctx.fillStyle = 'black';

  // write Hours
  ctx.save();
  ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();
  ctx.restore();

  // write Minutes
  ctx.save();
  ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(112, 0);
  ctx.stroke();
  ctx.restore();

  // Write seconds
  ctx.save();
  ctx.rotate(sec * Math.PI / 30);
  ctx.strokeStyle = '#D40000';
  ctx.fillStyle = '#D40000';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(83, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#325FA2';
  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.stroke();

  ctx.restore();

  if(!stopGpuTest) {
    window.requestAnimationFrame(clock);
  }
}




//https://www.quirksmode.org/rafp/
function testGpu() {
    var testName = "Grafikk-kort";
    var testId = "clientcheck_gpu_test";
    var info = "Videokonferanser krever en enhet med god grafikkytelse.";
    var error = "";
    var action = "Du bør bruke en enhet/nettleser med bedre grafikkytelse.";
    var success = ""

    let data = getVideoCardInfo();

    if(data.hasOwnProperty("error")){
        // Display error in the console
        error = data.error;
        incrementTestFailed();
        testFailed(testId, testName, info, error, action);

    } else if(data.hasOwnProperty("success")) {
        success = data.success;
        testSucceeded(testId, testName, success);
    }
    else {
        // Display information
        success = "<ul><li>" + data.vendor + "</li></li>" + data.renderer + "</ul>";
        testSucceeded(testId, testName, success);
        incrementTestSucceded();
    }    
}

/**
 * A very simple method to retrieve the name of the default videocard of the system
 * using webgl.
 * 
 * @see https://stackoverflow.com/questions/49267764/how-to-get-the-video-card-driver-name-using-javascript-browser-side
 * @returns {Object}
 */
function getVideoCardInfo() {
    const gl = document.createElement('canvas').getContext('webgl');

    if (!gl) {
        return {
            error: "Nettleseren din støtter ikke WEB GL",
        };
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if(debugInfo){
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer:  gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        };
    }

    return {
        success: "Nettleseren din støtter WEB GL men sikkerhetsinnstillingene på maskinen gjør at vi ikke kan se hva slags grafikkort som blir brukt.",
    };
}


//https://stackoverflow.com/questions/19754792/measure-cpu-performance-via-js/42147178
//_speedconstant=(knowncpuspeed*knowntimetocomplete)/knowncycles
function testCpuSpeed() {
    var _speedconstant = 1.15600e-8; //if speed=(c*a)/t, then constant=(s*t)/a and time=(a*c)/s
    var d = new Date();
    var estprocessor = 1.7; //average processor speed, in GHZ
    console.log("JSBenchmark by Aaron Becker, running loop " + iTestCpuSpeedAmount + " times.     Estimated time (for " + estprocessor + "ghz processor) is " + (Math.round(((_speedconstant * iTestCpuSpeedAmount) / estprocessor) * 100) / 100) + "s");
    for (iTestCpuSpeed = iTestCpuSpeedAmount; iTestCpuSpeed > 1; iTestCpuSpeed--) {
    }
    var newd = new Date();
    var accnewd = Number(String(newd.getSeconds()) + "." + String(newd.getMilliseconds()));
    var accd = Number(String(d.getSeconds()) + "." + String(d.getMilliseconds()));
    var di = accnewd - accd;
    //console.log(accnewd,accd,di);
    if (d.getMinutes() != newd.getMinutes()) {
      di = (60 * (newd.getMinutes() - d.getMinutes())) + di
    }
    spd = ((_speedconstant * iTestCpuSpeedAmount) / di);
    spdGhz = Math.round(spd * 1000) / 1000;
    console.log("Time: " + Math.round(di * 1000) / 1000 + "s, estimated speed: " + spdGhz + "GHZ");    
}

const fps = {
    sampleSize : 60,    
    value : 0,
    _sample_ : [],
    _index_ : 0,
    _lastTick_: false,
    tick : function(){
        // if is first tick, just set tick timestamp and return
        if( !this._lastTick_ ){
            this._lastTick_ = performance.now();
            return 0;
        }
        // calculate necessary values to obtain current tick FPS
        let now = performance.now();
        let delta = (now - this._lastTick_)/1000;
        let fps = 1/delta;
        // add to fps samples, current tick fps value 
        this._sample_[ this._index_ ] = Math.round(fps);
        
        // iterate samples to obtain the average
        let average = 0;
        for(i=0; i<this._sample_.length; i++) average += this._sample_[ i ];

        average = Math.round( average / this._sample_.length);

        // set new FPS
        this.value = average;
        // store current timestamp
        this._lastTick_ = now;
        // increase sample index counter, and reset it
        // to 0 if exceded maximum sampleSize limit
        this._index_++;
        if( this._index_ === this.sampleSize) this._index_ = 0;
        return this.value;
    }
}




function getRecommendedBrowsers() {
    return `Vi anbefaler siste versjon av:<ul>
    <li><a href="https://www.mozilla.org/nb-NO/" target="_blank">Firefox</a></li>
    <li><a href="https://www.opera.com" target="_blank">Opera</a></li>
    <li><a href="https://www.microsoft.com/nb-no/edge" target="_blank">Microsoft Edge</a></li>
    <li><a href="https://support.apple.com/downloads/#safari" target="_blank">Safari</a></li>
    <li><a href="https://www.google.com/chrome/browser/" target="_blank">Google Chrome</a></li>
    </ul>
    `;
}

function testBrowser()
{
    var testName = "Nettleser";
    var browserTestId = "clientcheck_browser_test";
    var info = "Noe av vårt innhold stiller krav til din nettleser.";
    var error = "";
    var action = "";
    var browserSupported = false;

    var browsers = ['Chrome','Firefox','Opera','Webkit','Safari'];
    var versions = ['30',    '40',     '17'   ,'5'     ,'5'];
    
    var browserName = get_browser();
    var browserVersion = get_browser_version();
    var browserstr =  browserName.replace(/\d/g, '').trim(); // Take away number from browser var, keep only string to match with "browsers array L256"
    var index = jQuery.inArray( browserstr , browsers);
    if( index >= 0 ) {
        var browservr = browserVersion.replace ( /[^\d.]/g, '' ); // Take away char from broswer version var, keep only number

        if( parseInt(browservr) >= parseInt(versions[index]) ) {
            browserSupported = true;
        }
        else {
            error = 'Din versjon av nettleseren er ikke støttet.';
            action = 'Vennligst oppgrader ' + browserName + ' minst til versjon ' + versions[index] + '.';
        }
    }
    else {
        error = 'Din nettleser (' + browserName + ' ' + versions[index] + ') er ikke offisielt støttet. Du kan forsøke å bruke nettleseren, men vi anbefaler på det sterkeste at du installerer en av de støttede nettleserne.';
        action = getRecommendedBrowsers();
    }

    if(simulateError("browser")) {
        error = 'Din nettleser (' + browserName + ' ' + versions[index] + ') er ikke offisielt støttet. Du kan forsøke å bruke nettleseren, men vi anbefaler på det sterkeste at du installerer en av de støttede nettleserne.';
        action = getRecommendedBrowsers();
        browserSupported = false;
    }
    if(!browserSupported)
    {
        incrementTestFailed();
        testFailed(browserTestId, testName, info, error, action);
    } else {
        testSucceeded(browserTestId, testName, browserName + " " +  browserVersion);
        incrementTestSucceded();
    }
}
function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1]||'');
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[0];
}

function get_browser_version(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1]||'');
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[1];
}

function simulateError(p)
{
    const pSet = urlParamsObj && urlParamsObj[p];
    if (pSet !== undefined && pSet == 1) {
        return true;
    }
    return false;
}

function urlParamsToObject() {
    if (document.location.search === '') return {};

    const search = location.search.substring(1);
    return JSON.parse(
        '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        (key, value) => key === "" ? value : decodeURIComponent(value)
    );
}

function testSpeed() {
    var testName = "Internett";
    var speedTestId = "clientcheck_speed_test";
    var info = "Videokonferanser krever god internettforbindelse.";
    var error = "Internettforbindelsen er dårlig: ";
    var noConnection = "Kunne ikke teste internettforbindelsen."
    var action = "Vis feilmeldingen til din IT-ansvarlige.";
    var success = "Internettforbindelsen er god: "

    testStart(testName);

    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }
    
    download.onerror = function (err, msg) {
        testEnd();
        incrementTestFailed();
        testFailed(speedTestId, testName, info, noConnection, action);
    }
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        testEnd();
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        if(simulateError("speed")){
            speedMbps = 0.54;
        }
        if(speedMbps > minimumSpeedRequirement) {
            incrementTestSucceded();
            testSucceeded(speedTestId, testName, success + speedMbps + " Mbps");
        } else {
            incrementTestFailed();
            testFailed(speedTestId, testName, info, error + speedMbps + " Mbps", action);
        }
    }
}