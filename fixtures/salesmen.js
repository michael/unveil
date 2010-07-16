var salesmen_fixture = {
  properties: {
    "name": {
      type: "string",
      name: "Name",
      unique: true
    },
    "hardware_turnover": {
      name: "Hardware Turnover",
      descr: "Monthly hardware turnover (in EUR)",
      type: "number",
      unique: false,
      categories: ["2005", "2006", "2007", "2008", "2009", "2010"]
    },
    "solution_turnover": {
      name: "Solution Turnover",
      descr: "Monthly solution turnover (in EUR)",
      type: "number",
      unique: false,
      categories: ["2005", "2006", "2007", "2008", "2009", "2010"]
    }
  },
  items: {
    "mayer": {
      name: "Mayer",
      hardware_turnover: [
        150.2,
        200.2,
        100.2,
        300.2,
        341.3,
        521.2
      ],
      solution_turnover: [
        211.2,
        155.2,
        122.2,
        361.5,
        100.5,
        200.8
      ]
    },
    "mueller": {
      name: "Mueller",
      hardware_turnover: [
        300.2,
        111.2,
        421.2,
        948.2,
        800.4,
        300.1
      ],
      solution_turnover: [
        111.2,
        230.2,
        531.2,
        444.5,
        555.4,
        238.9
      ]
    },
    "smith": {
      name: "Smith",
      hardware_turnover: [
        700.2,
        400.2,
        604.2,
        200.2,
        120.9,
        111.9
      ],
      solution_turnover: [
        177.2,
        655.2,
        422.2,
        433.5,
        333.1,
        211.5
      ]
    }
  }
};