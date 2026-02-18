document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => observer.observe(element));

  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const fields = [
      {
        input: name,
        errorId: "name-error",
        validate: (value) => value.trim().length >= 2,
        errorText: "Please enter your name.",
      },
      {
        input: email,
        errorId: "email-error",
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorText: "Please enter a valid email address.",
      },
      {
        input: message,
        errorId: "message-error",
        validate: (value) => value.trim().length >= 10,
        errorText: "Please enter at least 10 characters.",
      },
    ];

    let isValid = true;

    fields.forEach(({ input, errorId, validate, errorText }) => {
      const errorElement = document.getElementById(errorId);
      if (!validate(input.value)) {
        errorElement.textContent = errorText;
        isValid = false;
      } else {
        errorElement.textContent = "";
      }
    });

    if (!isValid) {
      successMessage.textContent = "";
      return;
    }

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("Calvix Automation contact form submission:", payload);
    successMessage.textContent = "Thanks, your message has been received.";
    form.reset();
  });


  if (window.paypal) {
    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription(data, actions) {
          return actions.subscription.create({
            plan_id: "P-1FR719478J294080YNGK3WYA",
          });
        },
        onApprove(data) {
          alert(`Subscription successful. ID: ${data.subscriptionID}`);
          console.log("PayPal subscription approved:", data);
        },
        onError(error) {
          console.error("PayPal subscription error:", error);
        },
      })
      .render("#paypal-button-container-P-1FR719478J294080YNGK3WYA");
  }

});
