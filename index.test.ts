import { By, Builder, WebDriver, WebElement } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "selenium-webdriver/firefox";
import "chromedriver";
import "geckodriver";

import { findByCss, findByXpath, findByXpathMany } from "./helpers";

const rootURL = "https://microsoftnews.msn.com/?pcsonly=true";

let driver: WebDriver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

beforeAll(async () => {
  driver = await new Builder().forBrowser("firefox").build();
});

afterAll(async () => {
  await driver.manage().deleteAllCookies();
  driver.quit();
});

it.skip("Compare infoplane slides count to preset value", async () => {
  await driver.get(rootURL);
  const expected_cards = 14;

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

it.skip("Use a card action to block a publisher, then check", async () => {
  //Handle double MUID bug
  await driver.get(rootURL);
  await sleep(1000);
  await driver.navigate().refresh();

  //todo: swap to using wait
  await sleep(4000);

  //grab the 7th card to check
  const cardPath =
    "(//div[contains(@class, 'river-DS-EntryPoint1-')]//div[contains(@class, 'contentPreview-DS-card1')])[8]";

  const card: WebElement = await findByXpath(cardPath, driver);

  const expected_text = await (await card.getText()).split("\n")[2];

  const settingIcon: WebElement = await findByXpath(
    `(${cardPath}//button)[2]`,
    driver
  );

  await settingIcon.click();

  const hideStoryButton: WebElement = await findByXpath(
    "//*[text()[contains(.,'Hide stories')]]",
    driver
  );

  await hideStoryButton.click();

  const confirmHideStoryButton: WebElement = await findByXpath(
    "//button//*[text()[contains(.,'Hide')]]",
    driver
  );

  await confirmHideStoryButton.click();

  const personalizeLink: WebElement = await findByXpath(
    "//a//*[text()[contains(.,'Personalize')]]",
    driver
  );

  await personalizeLink.click();
  await sleep(3000);

  const hiddenPublishersButton: WebElement = await findByXpath(
    "//div//*[text()[contains(.,'Hidden Publishers')]]",
    driver
  );

  await hiddenPublishersButton.click();

  const publisherCard: WebElement = await findByXpath(
    "//div[contains(@class, 'publisherCard-DS-EntryPoint')]",
    driver
  );

  const actual_text = await (await publisherCard.getText()).split("\n")[0];

  expect(expected_text).toEqual(actual_text);
});

it("Compares pivotnav interests to the interest page", async () => {
  await driver.get(rootURL);

  //find overflow expand button
  const overflowButton = await findByXpath(
    "//button[contains(@class, 'overflowButton-DS-EntryPoint1-')]",
    driver
  );

  await overflowButton.click();

  const navLinks: WebElement[] = await findByXpathMany(
    "//a[contains(@class, 'navigationItem-DS-EntryPoint1-')]",
    driver
  );

  let navText: string[] = [];

  for (let i = 0; i < navLinks.length; i++)
    if ((await navLinks[i]) && (await navLinks[i].isDisplayed()))
      navText.push(await navLinks[i].getText());

  const personalizeLink: WebElement = await findByXpath(
    "//a//*[text()[contains(.,'Personalize')]]",
    driver
  );

  const myCards: WebElement[] = await findByXpathMany(
    "//div[contains(@class, 'topicCard-DS-EntryPoint2-')]",
    driver
  );

  for (let i = 0; i < navLinks.length; i++)
    if ((await myCards[i]) && (await myCards[i].isDisplayed()))
      console.log(await myCards[i].getText());
});

function sleep(milliseconds: number) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
