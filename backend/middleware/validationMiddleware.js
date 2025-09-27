const { body, validationResult } = require("express-validator");
const dns = require("dns");

const validateRegistration = [
	(req, res, next) => {
		if (!req.body.email || !req.body.password) {
			return res.status(400).json({ message: "Please enter all fields" });
		}
		next();
	},
	// Validate email
	body("email")
		.isEmail()
		.withMessage("Please enter a valid email address.")
		.bail() // Stop running validators if the previous one failed
		.custom(async (email) => {
			const domain = email.split("@")[1];

			// Quick blacklist for common invalid domains
			const blockedDomains = ["example.com", "test.com", "invalid.com"];
			if (blockedDomains.includes(domain)) {
				return Promise.reject("This email domain is not allowed.");
			}

			// Check for valid MX records
			try {
				const addresses = await dns.promises.resolveMx(domain);
				if (!addresses || addresses.length === 0) {
					return Promise.reject(
						"Email domain does not exist or cannot receive mail."
					);
				}
			} catch (error) {
				// If DNS resolution fails
				return Promise.reject(
					"Email domain does not exist or cannot receive mail."
				);
			}
		}),

	// Validate password
	body("password")
		.isLength({ min: 8, max: 16 })
		.withMessage("Password must be between 8 and 16 characters long.")
		.matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/)
		.withMessage(
			"Password must contain at least one alphabet, one digit, and one symbol."
		),

	// Middleware to handle the validation result
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array()[0].msg });
		}
		next();
	},
];

module.exports = {
	validateRegistration,
};
