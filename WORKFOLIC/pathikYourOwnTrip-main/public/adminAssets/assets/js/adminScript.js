
$("#addPackBtn").click((e) => {
  if (document.getElementById("file-input").files.length == 0) {
    alert("no files selected");
    e.preventDefault();
    return;
  }
});
$("#addPackBtn2").click((e) => {
  if (document.getElementById("file-input").files.length == 0) {
    alert("no files selected");
    e.preventDefault();
    return;
  }
});


$(document).ready(function () {
  $("#dataTable").DataTable({
    pageLength: 5,
    lengthMenu: [
      [5, 10, 20, -1],
      [5, 10, 20, "All"],
    ],
    ordering: false,
  });
});

// $(document).ready(() => {
//   let Category = $("#packageCategoryInp").val();
//   jQuery("#packageCategoryDropDown").val(Category);
// });
$(document).ready(() => {
  let type = $("#packageTypeInp").val()
  let Category = $("#packageCategoryInp").val()
  jQuery('#packageType').val(type)
  jQuery('#packageCategory').val(Category)
})

$("#changePassBtn").click(() => {
  let pass1 = $("#currentPassword").val();
  let pass2 = $("#newPassword").val();
  let pass3 = $("#newPassword2").val();

  if (!pass1 || !pass2 || !pass3) {
    alert("Please Fill all the fields")
    return;
  }

  if (pass2 !== pass3) {
    alert("Password Mismated")
    return;
  }

  $.ajax({
    type: "post",
    url: "/changePass",
    data: {
      oldPassword: pass1,
      newPassword: pass2,
    },
    success: function (response) {
      if (response.success == true) {
        $("#modalCenter").modal("toggle");
        alert(response.message);
        $("#currentPassword").val("");
        $("#newPassword").val("");
        $("#newPassword2").val("");
      } else if (response.success == false) {
        alert(response.message);
      } else {
        alert("Try Again, Something went wrong");
      }
    },
  });
});

$("#mainPacKCat").change(() => {
  var val = $("#mainPacKCat").val();
  if (val == "Domestic") {
    $("#subPackCat").html("");
    $("#subPackCat").html(`
    <option selected disabled>Package Location</option>
    <option value="Backpacking">Backpacking Trip</option>
    <option value="Jibhi">Jibhi</option>
    <option value="Kashmir">Kashmir</option>
    <option value="Kheerganga">Kheerganga</option>
    <option value="Leh">Leh</option>
    <option value="Manali">Manali</option>
    <option value="McLeodganj">McLeodganj</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Spiti">Spiti</option>
    <option value="Udaipur">Udaipur</option>
    <option value="Weekend">Weekend Trip</option>`);
  } else if (val == "International") {
    $("#subPackCat").html("");
    $("#subPackCat").html(`
    <option selected disabled>Package Location</option>
    <option value="Bali">Bali</option>
    <option value="Dubai">Dubai</option>
    <option value="Maldives">Maldives</option>
    <option value="Singapore">Singapore</option>
    <option value="Thailand">Thailand</option>
    <option value="Vietnam">Vietnam</option>`);
  }

})