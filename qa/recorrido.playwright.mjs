// Pass a Playwright Page from MCP or an existing Playwright runner.
export async function responsiveScreens(page, screenshotDirectory) {
  const results = [];
  const origin = 'http://127.0.0.1:5173';
  for (const [width, height] of [[320, 740], [390, 844]]) {
    await page.setViewportSize({ width, height });
    const record = async (screen) => {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        height: innerHeight,
        document: document.documentElement.scrollWidth,
        shell: document.querySelector('.app-shell').getBoundingClientRect().width,
      }));
      if (dimensions.viewport !== width || dimensions.height !== height) {
        throw new Error(`Viewport not applied: ${JSON.stringify(dimensions)}`);
      }
      results.push({
        id: `I-${width}-${screen}`,
        status: dimensions.viewport === width &&
          dimensions.document <= width && dimensions.shell <= 480 ? 'PASS' : 'FAIL',
        ...dimensions,
      });
      await page.screenshot({
        path: `${screenshotDirectory}\\responsive-${width}-${screen}.png`,
        fullPage: true,
      });
    };

    await page.goto(`${origin}/#welcome`);
    await page.getByRole('button', { name: 'ES Castellano' }).click();
    await page.getByRole('heading', { name: 'Te damos la bienvenida', exact: true }).waitFor();
    await record('bienvenida');
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await record('inicio');
    await page.locator('.need-option.food').click();
    await record('pregunta-1');
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await record('pregunta-2');
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await record('pregunta-3');
    await page.getByRole('button', { name: 'Ver recursos', exact: true }).click();
    await page.getByRole('button', { name: 'Mapa', exact: true }).click();
    await page.locator('.leaflet-marker-icon').first().waitFor();
    await record('mapa');
    await page.getByRole('button', { name: 'Lista', exact: true }).click();
    await record('lista');
    await page.getByRole('button', { name: 'Más información', exact: true }).first().click();
    await record('detalle');
    await page.getByRole('button', { name: 'Volver a resultados' }).click();
    await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
    await record('favoritos');
    await page.getByRole('button', { name: 'Más', exact: true }).click();
    await record('mas');
  }
  return results;
}
