module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			gridTemplateColumns: {
				5: "repeat(5, minmax(150px, 1fr))",
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"],
	},
};
