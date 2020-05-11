import { By, Builder, WebDriver, WebElement } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "selenium-webdriver/firefox";
import "chromedriver";
import "geckodriver";

import { findByCss, findByXpath, findByXpathMany } from "./helpers";

const rootURL = "https://microsoftnews.msn.com/?pcsonly=true";
const expected_cards = 14;

let driver: WebDriver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

beforeAll(async () => {
  driver = await new Builder().forBrowser("firefox").build();
});

afterAll(async () => driver.quit());

it("initialises the context", async () => {
  await driver.get(rootURL);
});

it("Compare infoplane slides count to preset value", async () => {
  //find carousel container
  const anchor = await findByXpath(
    "//*[@class='carousel_tabPanels-DS-card1-1']",
    driver
  );

  //find carousel cards
  const cardsPath = `//div[contains(@class, 'carousel_tabPanel-DS-card1-')]`;

  //find next slide button
  const nextSlide = await findByXpath("//button[@title='Next Slide']", driver);

  const carouselCards: WebElement[] = await anchor.findElements(
    By.xpath(cardsPath)
  );
  const found_cards = carouselCards.length;

  //click through all cards
  for (let x = 0; x < found_cards - 1; x++) {
    await nextSlide.click();
  }

  const lastCardDisplayed = await carouselCards[found_cards - 1].isDisplayed();

  expect(found_cards).toEqual(expected_cards);
  expect(lastCardDisplayed).toEqual(true);
});

it.skip("Use a card action to block a publisher", async () => {
  //clear cookies
  //wait 400 ms
});
