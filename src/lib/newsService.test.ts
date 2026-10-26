import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waterNewsService } from '../../server/newsService';

test('waterNewsService provides verified articles with valid schemas', () => {
  const feed = waterNewsService.getNewsFeed({ limit: 10 });

  assert.ok(feed.articles.length > 0, 'Feed should contain articles');
  assert.ok(feed.total >= feed.articles.length, 'Total should be >= page articles');
  assert.equal(typeof feed.lastUpdated, 'string', 'lastUpdated should be an ISO date string');

  for (const article of feed.articles) {
    assert.ok(article.id, 'Article must have an id');
    assert.ok(article.headline, 'Article must have a headline');
    assert.ok(article.summary, 'Article must have a summary');
    assert.ok(article.publisher, 'Article must have a publisher');
    assert.ok(article.publishedAt, 'Article must have a publishedAt date');
    assert.ok(article.sourceUrl.startsWith('http'), 'Article sourceUrl must be a valid http(s) URL');
    assert.ok(['philippines', 'global'].includes(article.region), 'Region must be philippines or global');
  }
});

test('waterNewsService filters by region and category correctly', () => {
  const phFeed = waterNewsService.getNewsFeed({ region: 'philippines' });
  for (const article of phFeed.articles) {
    assert.equal(article.region, 'philippines');
  }

  const coralFeed = waterNewsService.getNewsFeed({ category: 'ocean_coral_reefs' });
  for (const article of coralFeed.articles) {
    assert.equal(article.category, 'ocean_coral_reefs');
  }
});

test('waterNewsService search matches keywords accurately', () => {
  const searchFeed = waterNewsService.getNewsFeed({ search: 'DENR' });
  assert.ok(searchFeed.articles.length > 0, 'Should find DENR articles');
  for (const article of searchFeed.articles) {
    const text = `${article.headline} ${article.summary} ${article.publisher} ${article.tags.join(' ')}`.toLowerCase();
    assert.ok(text.includes('denr'));
  }
});
