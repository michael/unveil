var countries_fixture = {
  "properties": {
    "name": {
      "type": "string",
      "property_key": "name",
      "unique": true,
      "value_key": "name",
      "name": "Country Name"
    },
    "currency_used": {
      "type": "string",
      "property_key": "currency_used",
      "unique": true,
      "value_key": "name",
      "name": "Currency used"
    },
    "form_of_government": {
      "type": "string",
      "property_key": "form_of_government",
      "unique": false,
      "value_key": "name",
      "name": "Form of governmennt"
    },
    "life_expectancy_male": {
      "type": "number",
      "unique": true,
      "name": "Life expectancy at birth (male)"
    },
    "population_0014": {
      "type": "number",
      "unique": true,
      "name": "Population ages 0-14 (% of total)"
    },
    "life_expectancy_female": {
      "type": "number",
      "unique": true,
      "name": "Life expectancy at birth (female)"
    },
    "official_language": {
      "type": "string",
      "property_key": "official_language",
      "unique": false,
      "value_key": "name",
      "name": "Official language"
    },
    "population": {
      "type": "number",
      "property_key": "/location/statistical_region/population",
      "unique": true,
      "value_key": "number",
      "name": "Population"
    },
    "population_65up": {
      "type": "number",
      "unique": true,
      "name": "Population ages 65 and above (% of total)"
    },
    "area": {
      "type": "number",
      "property_key": "/location/location/area",
      "unique": true,
      "name": "Area"
    },
    "gdp_nominal": {
      "type": "number",
      "property_key": "/location/statistical_region/gdp_nominal",
      "unique": true,
      "value_key": "amount",
      "name": "GDP nominal"
    },
    "date_founded": {
      "type": "date",
      "property_key": "/location/dated_location/date_founded",
      "name": "Date founded",
      "unqiue": true
    },
    "population_1564": {
      "type": "number",
      "unique": true,
      "name": "Population ages 15-65 (% of total)"
    }
  },
  "items": {
    "/en/angola": {
      "name": "Angola",
      "currency_used": "Angolan kwanza",
      "form_of_government": [
        "Republic",
        "Presidential system"
      ],
      "life_expectancy_male": 45.087,
      "population_0014": 45.2844221,
      "life_expectancy_female": 49.086,
      "official_language": [
        "Portuguese Language"
      ],
      "population": 18498000,
      "population_65up": 2.46411,
      "area": 1246700.0,
      "gdp_nominal": 95950000000.0,
      "date_founded": "1975-11-11",
      "population_1564": 52.251468
    },
    "/en/algeria": {
      "name": "Algeria",
      "currency_used": "Algerian dinar",
      "form_of_government": [
        "Presidential system",
        "Semi-presidential system"
      ],
      "life_expectancy_male": 70.991,
      "population_0014": 27.7493177,
      "life_expectancy_female": 73.857,
      "official_language": [
        "Arabic language",
        "Algerian Arabic",
        "French Language"
      ],
      "population": 34895000,
      "population_65up": 4.6111256,
      "area": 2381741.0,
      "gdp_nominal": 171300000000.0,
      "date_founded": "1962",
      "population_1564": 67.6395567
    },
    "/en/afghanistan": {
      "name": "Afghanistan",
      "currency_used": "Afghan afghani",
      "form_of_government": [
        "Presidential system",
        "Islamic republic"
      ],
      "life_expectancy_male": 43.975,
      "population_0014": 46.2996695,
      "life_expectancy_female": 43.916,
      "official_language": [
        "Persian language",
        "Dari",
        "Pashto language"
      ],
      "population": 28150000,
      "population_65up": 2.2288251,
      "area": 647500.0,
      "gdp_nominal": 8842000000.0,
      "date_founded": "1919-08-08",
      "population_1564": 51.4715055
    },
    "/en/aruba": {
      "name": "Aruba",
      "currency_used": "Aruban florin",
      "form_of_government": [
        "Constitutional monarchy"
      ],
      "life_expectancy_male": 72.108,
      "population_0014": 19.7997269,
      "life_expectancy_female": 77.399,
      "official_language": [
        "Dutch Language",
        "Papiamentu Language",
        "Spanish Language",
        "English Language"
      ],
      "population": 107000,
      "population_65up": 9.2256486,
      "area": 193.0,
      "gdp_nominal": 4548000000.0,
      "date_founded": "1986-01-01",
      "population_1564": 70.9746245
    },
    "/en/argentina": {
      "name": "Argentina",
      "currency_used": "Argentinian Peso",
      "form_of_government": [
        "Federal republic",
        "Presidential system"
      ],
      "life_expectancy_male": 71.653,
      "population_0014": 25.3920037,
      "life_expectancy_female": 79.199,
      "official_language": [
        "Spanish Language"
      ],
      "population": 39745613,
      "population_65up": 10.5106386,
      "area": 2780403.0,
      "gdp_nominal": 338700000000.0,
      "date_founded": "1816-07-09",
      "population_1564": 64.0973577
    },
    "/en/albania": {
      "name": "Albania",
      "currency_used": "Albanian lek",
      "form_of_government": [
        "Parliamentary system",
        "Parliamentary republic"
      ],
      "life_expectancy_male": 73.562,
      "population_0014": 24.2147097,
      "life_expectancy_female": 79.859,
      "official_language": [
        "Albanian language"
      ],
      "population": 3170000,
      "population_65up": 9.3330695,
      "area": 28748.0,
      "gdp_nominal": 13520000000.0,
      "date_founded": "1912-11-28",
      "population_1564": 66.4522209
    },
    "/en/azerbaijan": {
      "name": "Azerbaijan",
      "currency_used": "Azerbaijani manat",
      "form_of_government": [
        "Presidential system",
        "Parliamentary republic"
      ],
      "life_expectancy_male": 67.885,
      "population_0014": 24.6212459,
      "life_expectancy_female": 72.585,
      "official_language": [
        "Azerbaijani language"
      ],
      "population": 8629900,
      "population_65up": 6.7677999,
      "area": 86600.0,
      "gdp_nominal": 53260000000.0,
      "date_founded": "1991-08-30",
      "population_1564": 68.6109542
    },
    "/en/armenia": {
      "name": "Armenia",
      "currency_used": "Armenian dram",
      "form_of_government": [
        "Presidential system"
      ],
      "life_expectancy_male": 70.353,
      "population_0014": 20.5373009,
      "life_expectancy_female": 76.881,
      "official_language": [
        "Armenian Language"
      ],
      "population": 3230100,
      "population_65up": 11.5630578,
      "area": 29800.0,
      "gdp_nominal": 12070000000.0,
      "date_founded": "1918-05-28",
      "population_1564": 67.8996414
    },
    "/en/austria": {
      "name": "Austria",
      "currency_used": "Euro",
      "form_of_government": [
        "Federal republic",
        "Parliamentary republic"
      ],
      "life_expectancy_male": 77.75,
      "population_0014": 15.1978338,
      "life_expectancy_female": 83.28,
      "official_language": [
        "Croatian language",
        "Slovenian language",
        "Austrian German",
        "German Language",
        "Hungarian"
      ],
      "population": 8356700,
      "population_65up": 17.0078803,
      "area": 83872.0,
      "gdp_nominal": 432400000000.0,
      "date_founded": "1955-07-27",
      "population_1564": 67.7942859
    }
  }
}
