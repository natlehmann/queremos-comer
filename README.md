# Queremos comer!

### Armado del ambiente de desarrollo

* Instalar nodeJs y verificar que `node` y `npm` estén en la variable de entorno path
* Instalar el entorno de desarrollo para [Android](http://cordova.apache.org/docs/en/5.1.1/guide/platforms/android/index.html) o iPhone.
* Instalar cordova y ionic a través de npm:
```bash
npm install -g cordova ionic
```
* Verificar si se puede crear un proyecto de prueba:
```bash
ionic start myApp tabs
```
* Instalar RVM
```bash
sudo apt-get update
sudo apt-get install curl
\curl -L https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
rvm requirements
```
* Instalar Ruby
```bash
rvm install ruby
rvm use ruby --default
rvm rubygems current
gem install rails
```
* Instalar Sass
```bash
gem install sass
```
* Instalar Compass
```bash
gem install compass
```
* Instalar el generador de Yeoman
```bash
npm install -g yo grunt-cli bower generator-ionic
```
* Finalmente probar con
```bash
mkdir myApp
cd myApp
yo ionic myIonicApp
grunt serve
```