const { getNestedValue, parsePriceSymbol } = require("./utils");
const fs = require("fs").promises;

const regexNumber = /\d+/;

function standardizeSearch(results) {
  const datas = [];

  for (const result of results) {
    const typeName = getNestedValue(result, "__typename", "");
    if (typeName !== "StaySearchResult") {
      continue;
    }

    const lt = getNestedValue(result, "listing", {});
    const pr = getNestedValue(
      result,
      "pricingQuote.structuredStayDisplayPrice",
      {}
    );

    const data = {
      room_id: parseInt(lt.id),
      category: getNestedValue(lt, "roomTypeCategory", ""),
      kind: getNestedValue(lt, "pdpUrlType", ""),
      name: getNestedValue(lt, "name", ""),
      title: getNestedValue(lt, "title", ""),
      type: getNestedValue(lt, "listingObjType", ""),
      long_stay_discount: {},
      fee: {
        airbnb: {},
        cleaning: {},
      },
      price: {
        unit: {
          qualifier: getNestedValue(pr, "primaryLine.qualifier", ""),
        },
        total: {},
        break_down: [],
      },
      rating: {
        value: 0,
        reviewCount: 0,
      },
      images: [],
      badges: [],
      coordinates: {
        latitude: getNestedValue(lt, "coordinate.latitude", 0),
        longitude: getNestedValue(lt, "coordinate.longitude", 0),
      },
    };

    for (const badge of getNestedValue(lt, "formattedBadges", [])) {
      data.badges.push(getNestedValue(badge, "loggingContext.badgeType", ""));
    }

    const avgRatingLocalized = getNestedValue(lt, "avgRatingLocalized", "");
    const splited = avgRatingLocalized.split(" ");
    if (splited.length === 2) {
      data.rating.value = parseFloat(splited[0]);
      const reviewCountMatch = splited[1].match(regexNumber);
      data.rating.reviewCount = reviewCountMatch
        ? parseInt(reviewCountMatch[0])
        : 0;
    }

    let priceToUse =
      getNestedValue(pr, "primaryLine.originalPrice", "") ||
      getNestedValue(pr, "primaryLine.price", "");
    if (priceToUse) {
      const [amount, currency] = parsePriceSymbol(priceToUse);
      data.price.unit.currency_symbol = currency;
      data.price.unit.amount = amount;
    }

    const discountedPrice = getNestedValue(
      pr,
      "primaryLine.discountedPrice",
      ""
    );
    if (discountedPrice) {
      const [amount] = parsePriceSymbol(discountedPrice);
      data.price.unit.discount = amount;
    }

    const secondaryLineSplited = getNestedValue(
      pr,
      "secondaryLine.price",
      ""
    ).split(" ");
    let secondaryPriceToUse = "";
    switch (secondaryLineSplited.length) {
      case 2:
        secondaryPriceToUse = secondaryLineSplited[0];
        break;
      case 3:
        secondaryPriceToUse = secondaryLineSplited.slice(0, -1).join("");
        break;
      default:
        console.error("error check: ", secondaryLineSplited);
        continue;
    }

    const [totalAmount, totalCurrency] = parsePriceSymbol(secondaryPriceToUse);
    data.price.total.currency_symbol = totalCurrency;
    data.price.total.amount = totalAmount;

    for (const imageData of getNestedValue(lt, "contextualPictures", [])) {
      data.images.push({ url: getNestedValue(imageData, "picture", "") });
    }

    for (const priceDetail of getNestedValue(
      pr,
      "explanationData.priceDetails",
      []
    )) {
      if (!priceDetail.items) {
        continue;
      }

      for (const item of priceDetail.items) {
        const [amount, currency] = parsePriceSymbol(item.priceString);
        data.price.break_down.push({
          description: item.description,
          amount,
          currency_symbol: currency,
        });

        switch (item.displayComponentType) {
          case "DISCOUNTED_EXPLANATION_LINE_ITEM":
            if (item.description === "Long stay discount") {
              data.long_stay_discount.amount = amount;
              data.long_stay_discount.currency_symbol = currency;
            }
            break;
          case "DEFAULT_EXPLANATION_LINE_ITEM":
            if (item.description === "Cleaning fee") {
              data.fee.cleaning.amount = amount;
              data.fee.cleaning.currency_symbol = currency;
            } else if (item.description === "Airbnb service fee") {
              data.fee.airbnb.amount = amount;
              data.fee.airbnb.currency_symbol = currency;
            }
            break;
        }
      }
    }

    datas.push(data);
  }

  return datas;
}

function standardizeDetails(meta) {
  const ev = meta.data.presentation.stayProductDetailPage.sections.metadata;
  const data = {
    coordinates: {
      latitude: getNestedValue(ev, "listingLat", 0),
      longitude: getNestedValue(ev, "listingLng", 0),
    },
    // room_type: getNestedValue(ev, "roomType", ""),
    room_type: ev.loggingContext.eventDataLogging.roomType,
    is_super_host: getNestedValue(ev, "isSuperhost", ""),
    home_tier: getNestedValue(ev, "homeTier", ""),
    person_capacity: getNestedValue(ev, "personCapacity", 0),
    rating: {
      accuracy: getNestedValue(ev, "accuracyRating", 0),
      checking: getNestedValue(ev, "checkinRating", 0),
      cleanliness: getNestedValue(ev, "cleanlinessRating", 0),
      communication: getNestedValue(ev, "communicationRating", 0),
      location: getNestedValue(ev, "locationRating", 0),
      value: getNestedValue(ev, "valueRating", 0),
      guest_satisfaction: getNestedValue(ev, "guestSatisfactionOverall", 0),
      review_count: getNestedValue(ev, "visibleReviewCount", 0),
    },
    house_rules: {
      additional: "",
      general: [],
    },
    host: {
      id: "",
      name: "",
      joined_on: "",
      description: "",
    },
    sub_description: {
      title: "",
      items: [],
    },
    amenities: [],
    co_hosts: [],
    images: [],
    location_descriptions: [],
    highlights: [],
  };

  const sd = getNestedValue(
    meta,
    "data.presentation.stayProductDetailPage.sections.sections",
    []
  );

  // TODO this loop should wokr inside the else is statement below
  for (const item of meta.data.presentation.stayProductDetailPage.sections
    .sbuiData.sectionConfiguration.root.sections[1].sectionData
    .overviewItems) {
    // data.sub_description.items.push(getNestedValue(item, "title", ""));
    data.sub_description.items.push(item.title);
  }

  for (const section of getNestedValue(
    sd,
    "sectionConfiguration.root.sections",
    []
  )) {
    const typeName = getNestedValue(section, "sectionData.__typename", "");
    if (typeName === "PdpHostOverviewDefaultSection") {
      data.host = {
        id: getNestedValue(
          section,
          "sectionData.hostAvatar.loggingEventData.eventData.userId",
          ""
        ),
        name: getNestedValue(section, "sectionData.title", ""),
      };
    } else if (typeName === "PdpOverviewV2Section") {
      data.sub_description.title = getNestedValue(
        section,
        "sectionData.title",
        ""
      );
      // for (const item of getNestedValue(section, "sectionData.overviewItems", [])) {
      for (const item of meta.data.presentation.stayProductDetailPage.sections
        .sbuiData.sectionConfiguration.root.sections[1].sectionData
        .overviewItems) {
        console.log(item.title);
        // data.sub_description.items.push(getNestedValue(item, "title", ""));
        data.sub_description.items.push(item.title);
      }
    }
  }

  for (const section of getNestedValue(
    meta,
    "data.presentation.stayProductDetailPage.sections.sections",
    []
  )) {
    const typeName = getNestedValue(section, "section.__typename", "");
    switch (typeName) {
      case "HostProfileSection":
        data.host.id = getNestedValue(section, "section.hostAvatar.userID", "");
        data.host.name = getNestedValue(section, "section.title", "");
        data.host.joined_on = getNestedValue(section, "section.subtitle", "");
        data.host.description = getNestedValue(
          section,
          "section.hostProfileDescription.htmlText",
          ""
        );
        for (const cohost of getNestedValue(
          section,
          "section.additionalHosts",
          []
        )) {
          data.co_hosts.push({ id: cohost.id || "", name: cohost.name || "" });
        }
        break;
      case "PhotoTourModalSection":
        for (const mediaItem of getNestedValue(
          section,
          "section.mediaItems",
          []
        )) {
          data.images.push({
            title: mediaItem.accessibilityLabel || "",
            url: mediaItem.baseUrl || "",
          });
        }
        break;
      case "PoliciesSection":
        for (const houseRulesSection of getNestedValue(
          section,
          "section.houseRulesSections",
          []
        )) {
          const houseRule = {
            title: houseRulesSection.title || "",
            values: [],
          };
          for (const item of houseRulesSection.items || []) {
            if (item.title === "Additional rules") {
              data.house_rules.additional = getNestedValue(
                item,
                "html.htmlText",
                ""
              );
              continue;
            }
            houseRule.values.push({
              title: item.title || "",
              icon: item.icon || "",
            });
          }
          data.house_rules.general.push(houseRule);
        }
        break;
      case "LocationSection":
        for (const locationDetail of getNestedValue(
          section,
          "section.seeAllLocationDetails",
          []
        )) {
          data.location_descriptions.push({
            title: locationDetail.title || "",
            content: getNestedValue(locationDetail, "content.htmlText", ""),
          });
        }
        break;
      case "PdpTitleSection":
        // data.title = section.title || "";
        data.title =  meta.data.presentation.stayProductDetailPage.sections.metadata.seoFeatures.ogTags.ogDescription;
        break;
      case "PdpHighlightsSection":
        for (const highlightingData of getNestedValue(
          section,
          "section.highlights",
          []
        )) {
          data.highlights.push({
            title: highlightingData.title || "",
            subtitle: highlightingData.subtitle || "",
            icon: highlightingData.icon || "",
          });
        }
        break;
      case "PdpDescriptionSection":
        data.description = getNestedValue(
          section,
          "section.htmlDescription.htmlText",
          ""
        );
        break;
      case "AmenitiesSection":
        for (const amenityGroupRaw of getNestedValue(
          section,
          "section.seeAllAmenitiesGroups",
          []
        )) {
          const amenityGroup = {
            title: amenityGroupRaw.title || "",
            values: [],
          };
          for (const amenityRaw of amenityGroupRaw.amenities || []) {
            amenityGroup.values.push({
              title: amenityRaw.title || "",
              subtitle: amenityRaw.subtitle || "",
              icon: amenityRaw.icon || "",
              available: amenityRaw.available || "",
            });
          }
          data.amenities.push(amenityGroup);
        }
        break;
    }
  }

  return data;
}

module.exports = {
  standardizeSearch,
  standardizeDetails,
};
