(async () => {
    // For loop to run 3 times
    for (let iter = 0; iter < 3; iter++) {
        console.log('Crawl Iteration: ', iter + 1);
        // List of User data directory folders for random rotation
        const profiles  = [
            './userDataDir1/',
            './userDataDir2/',
            './userDataDir3/',
            './userDataDir4/',
            './userDataDir5/',
        ];
        const profileRandomIndex = Math.floor(Math.random() * profiles.length);
        const profile = profiles[profileRandomIndex];

        // List of driver arguments for random rotation
        const argsSets = [
            ['--disable-infobars','--disable-notifications','--disable-webgl','--disable-webrtc','--log-level=3','--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure','--disable-local-storage','--disable-extensions'],
            ['--disable-infobars','--disable-notifications','--disable-webgl','--disable-webrtc'],
            ['--log-level=3','--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure','--disable-local-storage','--disable-extensions','--disable-fonts','--disable-battery','--disable-audio','--window-size=1080,1080','--force-device-scale-factor=1','--use-gl=swiftshader','--headless'],
            ['--disable-infobars','--disable-notifications','--disable-webgl','--disable-webrtc','--disable-fonts','--disable-battery','--disable-audio','--force-device-scale-factor=1','--use-gl=swiftshader'],
            ['--disable-webgl','--disable-webrtc','--disable-fonts','--headless'],
        ];
        const argsRandomIndex = Math.floor(Math.random() * argsSets.length);
        const argsSet = argsSets[argsRandomIndex];
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            userDataDir: profile,
            args: argsSet
            });

        const page = await browser.newPage();
        // Setting random values of viewport
        await page.setViewport({
            width: Math.floor(Math.random() * 800) + 1200, // Random width between 1200 and 2000 pixels
            height: Math.floor(Math.random() * 600) + 800, // Random height between 800 and 1400 pixels
            });

        // Random waiting time before loading URL
        await page.waitForTimeout(Math.floor(Math.random() * 2000) + 1000); // Random wait time between 2000 and 5000 milliseconds

        //Clearing caches and cookies
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');
        await client.send('Storage.clearDataForOrigin', { origin: page.url(), storageTypes: 'local_storage' });

        // Looking for API response to extract relevant information
        page.on('response', async (response) => {
        const url = response.url();
        const status = response.status();
        if (url === 'https://creepjs-api.web.app/fp' && status === 200) {
            try {
                const data = await response.json(); // Parsing JSON to extract relevant fields
                const trust_score = data.score;
                const bot = data.bot;
                const fingerprint = data.fingerprint;
                const lies = JSON.parse(data.scoreData).liesPointGain;
                const outputFile = `json_data_${iter + 1}.json`;
                fs.writeFile(outputFile, JSON.stringify({ // Writing to a JSON file
                    trust_score: trust_score,
                    bot: bot,
                    fingerprint: fingerprint,
                    lies: lies
                    }), (err) => {});
                console.log('JSON generated: ', outputFile);
            }catch (error) {
                    console.error('Error parsing or extracting response content:', error);
                }}
            });

        await page.goto('https://abrahamjuliot.github.io/creepjs/'); //Opens the given URL
        await page.waitForTimeout(Math.floor(Math.random() * 3000) + 6000); // Random wait time between 12000 and 18000 milliseconds

        // Generate random coordinates for clicking
        const randomX = Math.floor(Math.random() * (1200 - 100) + 100); // Random X coordinate between 100 and 1200
        const randomY = Math.floor(Math.random() * (800 - 100) + 100); // Random Y coordinate between 100 and 800

        // Click randomly on the page
        await page.mouse.click(randomX, randomY);

        // Scroll randomly on the page
        const randomScrollY = Math.floor(Math.random() * 1000); // Random scroll distance between 0 and 1000 pixels
        await page.evaluate((scrollY) => {
            window.scrollBy(0, scrollY);
        }, randomScrollY);

        await page.waitForTimeout(Math.floor(Math.random() * 3000) + 6000); // Random wait time between 3000 and 9000 milliseconds

        const pdfOptions = {
        path: `pdf_capture_${iter + 1}.pdf`, // File path to save the PDF
        format: 'A4',
        printBackground: true,
        scale: 1,
        margin: {
          top: '0.5cm',
          right: '0.5cm',
          bottom: '0.5cm',
          left: '0.5cm'
        }
        };

        await page.pdf(pdfOptions);
        console.log('PDF generated: ', pdfOptions.path);
        await browser.close();  // Exiting
    }
})();
