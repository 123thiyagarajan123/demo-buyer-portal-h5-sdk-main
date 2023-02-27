# h5-sdk-template

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.5.

## Install

1. Clone

```sh
git clone --depth 1 ssh://git@oxfordssh.awsdev.infor.com:7999/m3-demo-services/templates/h5-sdk/h5-sdk-template.git <project-name>
```

2. Remove git

```sh
cd <project-name>

# unix
rm -rf .git

# powershell
# Remove-Item -Recurse -Force .git

# cmd
# rmdir /s /q .git
```

3. Add git

```sh
git init
git add .
git commit -m 'chore: init'

# (optional) create new repository in gitlab
git remote add origin ssh://git@oxfordssh.awsdev.infor.com:7999/m3-demo-services/h5-sdk/<project-name>.git
git push -u origin main
```

4. Install packages

```sh
npm install
```

5. Rename

```sh
npm run rename <project-name> # use lowercase and dashes for <project-name>
git add .
git commit -m 'chore: rename'
```

6. .ionapi credentials

Open `package.json` and change the references to `../<path-to-ionapis>/<tenant>.ionapi` to your local folder.

```json
  "scripts": {
    ...
    "login:m3": "... ../<path-to-ionapis>/<tenant>.ionapi",
    "login:ion": "... ../<path-to-ionapis>/<tenant>.ionapi",
  },
```

## Usage

```sh
# login
npm run login:m3
#npm run login:ion

# start dev server and visit http://localhost:8080
npm run start:m3
#npm run start:ion
```

```sh
# add new features, fixes etc...
npm run commit:cli
npm run release

# when happy release version 1.0.0
npm run commit:cli
npm run release:1.0.0

# after releasing version 1.0.0 continue to add new features, fixes etc...
npm run commit:cli
npm run release
```

I want to build odin .zip file only:

```sh
npm run build
```

## Translation

```html
<ng-container *transloco="let t">
  ...
  <h1>{{ t('<SCOPE_ID>.<TRANSLATION_ID>') }}</h1>
  ...
</ng-container>
```

## Layouts

SINGLE COLUMN (SCROLLING)

```html
<h5-main [pageContainer]="true" [scrollable]="true">
  <h5-frame [main]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>
</h5-main>
```

THREE COLUMN (SCROLLING)

```html
<h5-main [pageContainer]="true" [threeColumn]="true" [scrollable]="true">
  <h5-frame [sidebar]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>

  <h5-frame [main]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>

  <h5-frame [sidebar]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>
</h5-main>
```

TWO COLUMN (SCROLLING)

```html
<h5-main [pageContainer]="true" [scrollable]="true" [twoColumn]="true">
  <h5-frame [sidebar]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>

  <h5-frame [main]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>
</h5-main>
```

SINGLE COLUMN + CARD (SCROLLING )

```html
<h5-main [pageContainer]="true" [scrollable]="true">
  <h5-frame [singleColumn]="true">
    <app-card [autoHeight]="true">
      <app-lorem></app-lorem>
    </app-card>
    <app-card [doubleHeight]="true">
      <app-lorem></app-lorem>
    </app-card>
    <app-card [autoHeight]="true">
      <app-lorem></app-lorem>
    </app-card>
  </h5-frame>
</h5-main>
```

TWO COLUMN (FIXED)

```html
<h5-main [pageContainer]="true" [fixed]="true" [both]="true" [twoColumn]="true">
  <h5-frame [sidebar]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>

  <h5-frame [main]="true" [scrollableY]="true">
    <app-lorem></app-lorem>
  </h5-frame>
</h5-main>
```

## Patterns

Master - Detail

```html
<h5-main [pageContainer]="true" [scrollable]="true">
  <h5-frame [main]="true">
    <div class="master-detail">
      <div class="master">
        <app-lorem></app-lorem>
      </div>
      <div class="detail">
        <app-lorem></app-lorem>
      </div>
    </div>
  </h5-frame>
</h5-main>
```

Master - Detail (banner)

```html
<h5-main [pageContainer]="true" [scrollable]="true">
  <h5-frame [main]="true">
    <app-banner-detail>
      <app-banner>
        <app-lorem></app-lorem>
      </app-banner>

      <app-detail>
        <app-lorem></app-lorem>
      </app-detail>
    </app-banner-detail>
  </h5-frame>
</h5-main>
```

---

## Scaffolding

Replace **example** with your name

```sh
# feature
npx ng g module features/example --route example --module app.module

# page
npx ng g component features/example/pages/example-page/example-page --skip-tests

# component
npx ng g component features/example/components/example/example --skip-tests

# resolver
npx ng g resolver features/example/services/example-page --skip-tests

# service
npx ng g service features/example/services/example --skip-tests

# type
ng g interface features/example/types/example type

# model
ng g class features/example/models/example --type model --skip-tests
```
