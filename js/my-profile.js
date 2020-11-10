function getProfileForm() {
    const form = document.querySelector("#profile-form");
    return {
        firstName: form.querySelector("#firstName").value,
        middleName: form.querySelector("#middleName").value,
        lastName1: form.querySelector("#lastName1").value,
        lastName2: form.querySelector("#lastName2").value,
        dateOfBirth: form.querySelector("#dateOfBirth").value,
        email: form.querySelector("#email").value,
        phone: form.querySelector("#phone").value,
        image: form.querySelector("#currentAvatarImage").src
    }
}

function setProfileForm(data) {
    if (!data) return;
    const form = document.querySelector("#profile-form");
    form.querySelector("#firstName").value = data.firstName || "";
    form.querySelector("#middleName").value = data.middleName || "";
    form.querySelector("#lastName1").value = data.lastName1 || "";
    form.querySelector("#lastName2").value = data.lastName2 || "";
    form.querySelector("#dateOfBirth").value = data.dateOfBirth || "";
    form.querySelector("#email").value = data.email || "";
    form.querySelector("#phone").value = data.phone || "";
    form.querySelector("#currentAvatarImage").src = data.image || "img/default-avatar.svg";
}

function getProfile() {
    if (!!localStorage['profile']) {
        return JSON.parse(localStorage['profile']);
    } else {
        return {};
    }
}

function setProfile(data) {
    if (!data) return;
    const currentProfile = getProfile();
    localStorage.setItem('profile', JSON.stringify({
        firstName: data.firstName || currentProfile.firstName,
        middleName: data.middleName || currentProfile.middleName,
        lastName1: data.lastName1 || currentProfile.lastName1,
        lastName2: data.lastName2 || currentProfile.lastName2,
        dateOfBirth: data.dateOfBirth || currentProfile.dateOfBirth,
        email: data.email || currentProfile.email,
        phone: data.phone || currentProfile.phone,
        image: data.image || currentProfile.image
    }));

    showAlert("Datos guardados correctamente", "success");
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) reject("No selected file");
        let reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result);
        }
        reader.readAsDataURL(file);
    });
}

function startAvatarSelectionForm() {
    const avatarSelectionForm = document.querySelector('#avatarSelectionForm');
    const selectedAvatarImage = avatarSelectionForm.querySelector("#selectedAvatarImage");

    const avatarImageURL = avatarSelectionForm.querySelector("#avatarImageURL");
    const clearImageURL = avatarSelectionForm.querySelector("#clearImageURL");

    const avatarImageFile = avatarSelectionForm.querySelector("#avatarImageFile");
    const avatarImageFileLabel = avatarSelectionForm.querySelector("#avatarImageFileLabel");

    const btnAvatarFile = avatarSelectionForm.querySelector("#btnAvatarFile");
    const btnAvatarURL = avatarSelectionForm.querySelector("#btnAvatarURL");

    const panelAvatarFile = avatarSelectionForm.querySelector("#panelAvatarFile");
    const panelAvatarURL = avatarSelectionForm.querySelector("#panelAvatarURL");

    const currentAvatarImage = document.querySelector("#currentAvatarImage");

    let imageUrl = "";

    panelAvatarURL.style.display = "none";

    btnAvatarFile.addEventListener("click", () => {

        avatarImageFile.disabled = false;
        avatarImageURL.disabled = true;

        panelAvatarFile.style.display = "";
        panelAvatarURL.style.display = "none";

        btnAvatarFile.classList.add("active");
        btnAvatarURL.classList.remove("active");
    });

    btnAvatarURL.addEventListener("click", () => {

        avatarImageFile.disabled = true;
        avatarImageURL.disabled = false;

        panelAvatarFile.style.display = "none";
        panelAvatarURL.style.display = "";

        btnAvatarFile.classList.remove("active");
        btnAvatarURL.classList.add("active");
    });

    avatarImageFile.addEventListener('change', () => {
        fileToDataURL(avatarImageFile.files[0])
            .then(data => {
                avatarImageFileLabel.innerHTML = avatarImageFile.files[0].name || "";
                selectedAvatarImage.src = data || "img/default-avatar.svg";
                imageUrl = data || "img/default-avatar.svg";
            }).catch(() => {
                avatarImageFileLabel.innerHTML = "";
                selectedAvatarImage.src = "img/default-avatar.svg";
                imageUrl = "img/default-avatar.svg";
            });
    });

    avatarImageURL.addEventListener('change', () => {
        imageUrl = avatarImageURL.value;
        selectedAvatarImage.src = avatarImageURL.value || "img/default-avatar.svg";
    });

    avatarSelectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!imageUrl) return;
        const profileData = getProfile();
        profileData.image = imageUrl;
        currentAvatarImage.src = imageUrl;
        $("#avatarSelectionForm").modal('hide');
    });

    selectedAvatarImage.addEventListener("error", (e) => {
        selectedAvatarImage.src = "img/default-avatar.svg";
    });

    clearImageURL.addEventListener("click", (e) => {
        e.preventDefault();
        avatarImageURL.value = "";
        selectedAvatarImage.src = "img/default-avatar.svg";
    });
}

function startProfileForm() {
    setProfileForm(getProfile());
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        setProfile(getProfileForm());
        setProfileForm();
    });
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    startProfileForm();
    startAvatarSelectionForm();
});