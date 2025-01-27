const scanButton = document.getElementById('scanButton');
scanButton.addEventListener('click', async () => {
    window.open('/cylinder_reg/camera/', "_blank");
});

const urlParams = new URLSearchParams(window.location.search);
const number = urlParams.get('number');

if (number) {
    for (let i = 0; i < 8; i++) {
        const box = document.getElementById(`box${i + 1}`);
        box.value = number[i];
    }
}

document.getElementById('submitButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const tagNumber = Array.from({ length: 8 }, (_, i) => document.getElementById(`box${i + 1}`).value).join('');
    const weight = document.getElementById('weight-dropdown').value;
    const cylinderNumber = document.getElementById('cylinder-number').value;
    const manufactureDate = document.getElementById('manufacture-date').value;
    const expireDate = document.getElementById('expire-date').value;
    const errorDiv = document.getElementById('error-div');


    if (tagNumber.length !== 8) {
        errorDiv.style.display = "block";
        return;
    }
   else{
       errorDiv.style.display = "none";
     }

    if (!weight) {
        alert("Please select the weight.");
        return;
    }

    if (!cylinderNumber) {
        alert("Please enter a cylinder number.");
        return;
    }
    if(!manufactureDate){
         alert("Please select the manufacture date.");
          return;
        }
       if(!expireDate){
            alert("Please select the expire date.");
           return;
        }


    try {
        const response = await fetch('http://10.102.112.11:8089/api/gas-cylinder/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cylinder_number": cylinderNumber,
                "tag_number": tagNumber,
                "weight": parseInt(weight),
                "unit_type": "KG",
                "registration_date": "2024-12-17",
                 "manufacture_date": manufactureDate,
                "expire_date": expireDate
            })
        });

        if (response.ok) {
            alert('Cylinder data submitted successfully!');
        } else {
            alert("There was some error!");
        }
    } catch (e) {
        console.log(e);
    }
});