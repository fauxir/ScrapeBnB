const axios = require('axios');
const querystring = require('querystring');
const { getNestedValue, removeSpace, parsePriceSymbol } = require('./utils');

const ep = "https://www.airbnb.com/api/v3/StaysPdpSections/80c7889b4b0027d99ffea830f6c0d4911a6e863a957cbe1044823f0fc746bf1f";

async function getPrice(productId, impressionId, apiKey, currency, cookies, checkIn, checkOut, proxyUrl) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Airbnb-Api-Key": apiKey,
    };

    const extension = {
        persistedQuery: {
            version: 1,
            sha256Hash: "80c7889b4b0027d99ffea830f6c0d4911a6e863a957cbe1044823f0fc746bf1f",
        },
    };

    const variablesData = {
        id: productId,
        pdpSectionsRequest: {
            adults: "1",
            bypassTargetings: false,
            categoryTag: null,
            causeId: null,
            children: null,
            disasterId: null,
            discountedGuestFeeVersion: null,
            displayExtensions: null,
            federatedSearchId: null,
            forceBoostPriorityMessageType: null,
            infants: null,
            interactionType: null,
            layouts: ["SIDEBAR", "SINGLE_COLUMN"],
            pets: 0,
            pdpTypeOverride: null,
            photoId: null,
            preview: false,
            previousStateCheckIn: null,
            previousStateCheckOut: null,
            priceDropSource: null,
            privateBooking: false,
            promotionUuid: null,
            relaxedAmenityIds: null,
            searchId: null,
            selectedCancellationPolicyId: null,
            selectedRatePlanId: null,
            splitStays: null,
            staysBookingMigrationEnabled: false,
            translateUgc: null,
            useNewSectionWrapperApi: false,
            sectionIds: ["BOOK_IT_FLOATING_FOOTER","POLICIES_DEFAULT","EDUCATION_FOOTER_BANNER_MODAL",
                "BOOK_IT_SIDEBAR","URGENCY_COMMITMENT_SIDEBAR","BOOK_IT_NAV","MESSAGE_BANNER","HIGHLIGHTS_DEFAULT",
                "EDUCATION_FOOTER_BANNER","URGENCY_COMMITMENT","BOOK_IT_CALENDAR_SHEET","CANCELLATION_POLICY_PICKER_MODAL"],
            checkIn: checkIn,
            checkOut: checkOut,
            p3ImpressionId: impressionId,
        },
    };

    const query = {
        operationName: "StaysPdpSections",
        locale: "en",
        currency: currency,
        variables: JSON.stringify(variablesData),
        extensions: JSON.stringify(extension),
    };

    const url = `${ep}?${querystring.stringify(query)}`;

    const axiosConfig = {
        headers: headers,
        withCredentials: true,
    };

    if (proxyUrl) {
        axiosConfig.proxy = {
            protocol: 'http',
            host: proxyUrl.split(':')[0],
            port: parseInt(proxyUrl.split(':')[1]),
        };
    }

    // Set cookies
    if (cookies) {
        axiosConfig.headers.Cookie = Object.entries(cookies)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
    }

    try {
        const response = await axios.get(url, axiosConfig);
        const data = response.data;

        const sections = getNestedValue(data, "data.presentation.stayProductDetailPage.sections.sections", []);
        for (const section of sections) {
            if (section.sectionId === "BOOK_IT_SIDEBAR") {
                const priceData = getNestedValue(section, "section.structuredDisplayPrice", {});
                const finalData = {
                    main: {
                        price: getNestedValue(priceData, "primaryLine.price", {}),
                        discountedPrice: getNestedValue(priceData, "primaryLine.discountedPrice", {}),
                        originalPrice: getNestedValue(priceData, "primaryLine.originalPrice", {}),
                        qualifier: getNestedValue(priceData, "primaryLine.qualifier", {}),
                    },
                    details: {},
                };

                const details = getNestedValue(priceData, "explanationData.priceDetails", []);
                for (const detail of details) {
                    for (const item of getNestedValue(detail, "items", [])) {
                        finalData.details[item.description] = item.priceString;
                    }
                }

                return finalData;
            }
        }

        return {};
    } catch (error) {
        console.error('Error fetching price data:', error);
        throw error;
    }
}

module.exports = { getPrice };