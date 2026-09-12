
export function validateCheckoutForm(formData) {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9][0-9]{9}$/;
  const zipRegex = /^[0-9]{6}$/;

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else {
    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      newErrors.phone = "Mobile number must be exactly 10 digits";
    } else if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone =
        "Please enter a valid Indian mobile number (starts with 6,7,8, or 9)";
    }
  }

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
  }

  if (!formData.area.trim()) {
    newErrors.area = "Address is required";
  }

  if (!formData.city.trim()) {
    newErrors.city = "City is required";
  }

  if (!formData.state.trim()) {
    newErrors.state = "State is required";
  }

  if (!formData.zipCode.trim()) {
    newErrors.zipCode = "ZIP code is required";
  } else {
    const cleanedZip = formData.zipCode.replace(/\D/g, "");
    if (cleanedZip.length !== 6) {
      newErrors.zipCode = "ZIP code must be exactly 6 digits";
    } else if (!zipRegex.test(cleanedZip)) {
      newErrors.zipCode = "Please enter a valid 6-digit ZIP code";
    }
  }

  return newErrors;
}