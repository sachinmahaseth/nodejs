let pathname = window.location.pathname;
if (pathname === "/") {
    setTimeout(() => {
        $("#popupmodal").modal("toggle");
    }, 1000);
}

$(window).on("scroll", function () {
    if ($(window).scrollTop() > 1) {
        $("#largerNav").addClass("activeNavbar");
    } else {
        $("#largerNav").removeClass("activeNavbar");
    }
});

$(window).on("scroll", function () {
    if ($(window).scrollTop() > 1) {
        $("#smallNav").addClass("activeNavbar");
    } else {
        $("#smallNav").removeClass("activeNavbar");
    }
});

function errorAlert(text) {
    iziToast.error({
        title: 'Error',
        message: text,
    });
}

function successAlert(text) {
    iziToast.success({
        title: 'OK',
        message: text,
    });
}

function openNav() {
    document.getElementById("mySidenav").style.width = "330px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


$("#sendPopUp").click(() => {

    let name = $("#promoNameInp").val();
    let mobile = parseInt($("#promoMobileInp").val());
    if (isNaN(mobile)) {
        errorAlert("Please enter a valid mobile number");
        $("#sendPopUp").text("Send Details");
        return;
    }
    let email = $("#promoEmailInp").val();
    let peopleCount = $("#promoPeopleCountInp").val();
    let destination = $("#promoDestinationInp").val();


    if (!name || !mobile || !email || !peopleCount || !destination) {
        errorAlert("Please fill all the required fields");
        return;
    }

    $("#sendPopUp").text("Sending Details ...");

    let mobileRegX = /^[789]\d{9}$/;
    let isValidMobile = mobileRegX.test(mobile);
    if (!isValidMobile) {
        errorAlert("Please enter a valid mobile")
        $("#sendPopUp").text("Send Details");
        return;
    }

    var validMailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    checkMail = email.match(validMailRegex);
    if (!checkMail) {
        errorAlert("Please Enter valid email")
        $("#sendPopUp").text("Send Details");
        return;
    }

    $.ajax({
        type: "post",
        url: "/popForm",
        data: {
            name,
            mobile,
            email,
            peopleCount,
            destination,
        },
        success: function (response) {
            if (response.success == true) {
                $("#promoNameInp").val("");
                $("#promoMobileInp").val("");
                $("#promoEmailInp").val("");
                $("#promoPeopleCountInp").val("");
                $("#promoDestinationInp").val("");
                $("#popupmodal").modal("toggle");
                successAlert("Thank you for contacting with us");
                $("#sendPopUp").text("Send Details");
            } else {
                errorAlert("Try Again, Something went wrong")
                $("#sendPopUp").text("Send Details");
            }
        }
    });
})


$("#sendMessage").click(() => {

    let name = $("#nameInp").val();
    let mobile = parseInt($("#mobileInp").val());
    if (isNaN(mobile)) {
        errorAlert("Please enter a valid mobile number");
        $("#sendMessage").text("Send Message");
        return;
    }
    let email = $("#emailInp").val();
    let message = $("#messageInp").val();


    if (!name || !mobile || !email || !message) {
        errorAlert("Please fill all the required fields");
        return;
    }

    $("#sendMessage span").text("Sending Message ...");

    let mobileRegX = /^[789]\d{9}$/;
    let isValidMobile = mobileRegX.test(mobile);
    if (!isValidMobile) {
        errorAlert("Please enter a valid mobile")
        $("#sendMessage span").text("Send Message");
        return;
    }

    var validMailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    checkMail = email.match(validMailRegex);
    if (!checkMail) {
        errorAlert("Please Enter valid email")
        $("#sendMessage span").text("Send Message");
        return;
    }

    $.ajax({
        type: "post",
        url: "/contactForm",
        data: {
            name,
            mobile,
            email,
            message,
        },
        success: function (response) {
            if (response.success == true) {
                $("#nameInp").val("");
                $("#mobileInp").val("");
                $("#emailInp").val("");
                $("#messageInp").val("");
                successAlert("Thank you for contacting with us");
                $("#sendMessage span").text("Send Message");
            } else {
                errorAlert("Try Again, Something went wrong")
                $("#sendMessage span").text("Send Message");
            }
        }
    });
})


// Run script according to URL

var pattern = /^\/category\/([^\/]+)\/([^\/]+)\/$/;
var match = pathname.match(pattern);
if (match) {

    let priceList = JSON.parse($("#priceData").val());

    // $("#priceDropDown").change(() => {
    //     let type = $("#priceDropDown").find(":selected").val();

    //     if (type === "Budget") {
    //         $(".mainPriceBox").text(priceList.budgetPrice);
    //     } else if (type === "Standard") {
    //         $(".mainPriceBox").text(priceList.standardPrice);
    //     } else if (type === "Deluxe") {
    //         $(".mainPriceBox").text(priceList.deluxePrice);
    //     } else if (type === "Luxury") {
    //         $(".mainPriceBox").text(priceList.luxuryPrice);
    //     } else if (type === "Premium") {
    //         $(".mainPriceBox").text(priceList.premiumPrice);
    //     }
    // });

    let datesListArray = $("#datesListArray").val().split("::");
    flatpickr("#calendar", {
        dateFormat: "d-m-Y",
        enable: datesListArray,
    });


    $("#peopleCount").change(() => {
        let type = $("#priceDropDown").find(":selected").val();
        let count = $("#peopleCount").find(":selected").val();
        if (type === "Budget") {
            let totalPrice = priceList.budgetPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Standard") {
            let totalPrice = priceList.standardPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Deluxe") {
            let totalPrice = priceList.deluxePrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Luxury") {
            let totalPrice = priceList.luxuryPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Premium") {
            let totalPrice = priceList.premiumPrice * count;
            $(".mainPriceBox").text(totalPrice);
        }
    });

    $("#priceDropDown").change(() => {
        let type = $("#priceDropDown").find(":selected").val();
        let count = $("#peopleCount").find(":selected").val();
        console.log('count: ', count);
        if (count == "0") {
            count = 1;
        }
        if (type === "Budget") {
            let totalPrice = priceList.budgetPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Standard") {
            let totalPrice = priceList.standardPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Deluxe") {
            let totalPrice = priceList.deluxePrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Luxury") {
            let totalPrice = priceList.luxuryPrice * count;
            $(".mainPriceBox").text(totalPrice);
        } else if (type === "Premium") {
            let totalPrice = priceList.premiumPrice * count;
            $(".mainPriceBox").text(totalPrice);
        }
    });
}

$("#bookingBtn").click(() => {
    let packageId = $("#packageId").val();
    let holidayType = $("#priceDropDown").find(":selected").val();
    let roomCount = $("#roomCount").find(":selected").val();
    let peopleCount = $("#peopleCount").find(":selected").val();
    let fullNameInp = $("#fullNameInp").val();

    let mobileInp = parseInt($("#mobileInp").val());

    let emailInp = $("#emailInp").val();
    let bookingDate = $("#calendar").val();

    if (!holidayType || !roomCount || !peopleCount || !fullNameInp || !mobileInp || !emailInp || !bookingDate) {
        errorAlert("Please fill all the required fields");
        return;
    }

    if (peopleCount == 0) {
        errorAlert("Please Select No. of Adult");
        return;
    }


    if (isNaN(mobileInp)) {
        errorAlert("Please enter a valid mobile number");
        $("#sendMessage").text("Send Message");
        return;
    }

    let mobileRegX = /^[789]\d{9}$/;
    let isValidMobile = mobileRegX.test(mobileInp);
    if (!isValidMobile) {
        errorAlert("Please enter a valid mobile")
        return;
    }

    var validMailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    checkMail = emailInp.match(validMailRegex);
    if (!checkMail) {
        errorAlert("Please Enter valid email")
        return;
    }

    let btnVal = $("#bookingBtn").text()
    $("#bookingBtn").text("Booking Your Package ...")

    $.ajax({
        type: "post",
        url: "/bookPackage",
        data: {
            packageId, holidayCategory: holidayType, roomCount: roomCount, adultCount: peopleCount, name: fullNameInp, mobile: mobileInp, email: emailInp, bookingDate: bookingDate
        },
        success: function (response) {
            if (response.success === true) {
                console.log('response: ', response);
                $('#priceDropDown').prop('selectedIndex', 0);
                $('#roomCount').prop('selectedIndex', 0);
                $('#peopleCount').prop('selectedIndex', 0);
                $("#fullNameInp").val("");
                $("#mobileInp").val("");
                $("#emailInp").val("");
                $("#calendar").val("");
                successAlert("Thank you for booking, Your booking is confirmed.");
                $("#bookingBtn").text("Thank you for booking")
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                errorAlert("Please Enter valid email")
                $("#bookingBtn").text(btnVal)
                return;
            }

        }
    });

})


$(function () {
    var slides = $(".slides"),
        images = slides.find("img");

    images.each(function (i) {
        $(this).attr("data-id", i + 1);
    });

    var typed = new Typed(".typed-words", {
        strings: ["Trip", "Trip"],
        typeSpeed: 80,
        backSpeed: 80,
        backDelay: 4000,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        preStringTyped: (arrayPos, self) => {
            arrayPos++;
            $(".slides img").removeClass("active");
            $('.slides img[data-id="' + arrayPos + '"]').addClass("active");
        },
    });
});