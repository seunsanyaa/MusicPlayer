/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'res.cloudinary.com',
			'emojipedia-us.s3.dualstack.us-west-1.amazonaws.com',
			'gateway.pinata.cloud',
		],
	},
};

module.exports = nextConfig;
