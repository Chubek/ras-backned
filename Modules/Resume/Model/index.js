/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com --- April 2020, Corona Times */

require("dotenv");
const mongoose = require("mongoose");
const jumblator = require("mongoose-jumblator").fieldEncryptionPlugin;
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
  createdInfo: {
    userId: String,
    resumeName: String,
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  templateInfo: {
    templateId: String,
    png: [
      {
        dateRendered: Date,
        url: String,
      },
    ],
    pdf: [
      {
        dateRendered: Date,
        url: String,
      },
    ],
  },
  editCaptures: [
    {
      editDate: Date,
      capture: ResumeSchema,
    },
  ],
  contactInfo: {
    firstName: {
      type: String,
      validate: {
        validator: (v) => {
          /^[A-Z][a-z]+/.test(v);
        },
      },
    },
    lastName: {
      type: String,
      validate: {
        validator: (v) => {
          /^[A-Z][a-z]/.test(v);
        },
      },
    },
    phoneNumber: {
      type: String,
      encrypt: true,
      searchable: true,
      validate: {
        validator: (v) => {
          /^[0-9]*/.test(v);
        },
      },
    },
    emailAddress: {
      type: String,
      encrypt: true,
      searchable: true,
      validate: {
        validator: (v) => {
          const pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
          pattern.test(v);
        },
      },
    },
    city: String,
    state: {
      enum: [
        "AK - Alaska",
        "AL - Alabama",
        "AR - Arkansas",
        "AS - American Samoa",
        "AZ - Arizona",
        "CA - California",
        "CO - Colorado",
        "CT - Connecticut",
        "DC - District of Columbia",
        "DE - Delaware",
        "FL - Florida",
        "GA - Georgia",
        "GU - Guam",
        "HI - Hawaii",
        "IA - Iowa",
        "ID - Idaho",
        "IL - Illinois",
        "IN - Indiana",
        "KS - Kansas",
        "KY - Kentucky",
        "LA - Louisiana",
        "MA - Massachusetts",
        "MD - Maryland",
        "ME - Maine",
        "MI - Michigan",
        "MN - Minnesota",
        "MO - Missouri",
        "MS - Mississippi",
        "MT - Montana",
        "NC - North Carolina",
        "ND - North Dakota",
        "NE - Nebraska",
        "NH - New Hampshire",
        "NJ - New Jersey",
        "NM - New Mexico",
        "NV - Nevada",
        "NY - New York",
        "OH - Ohio",
        "OK - Oklahoma",
        "OR - Oregon",
        "PA - Pennsylvania",
        "PR - Puerto Rico",
        "RI - Rhode Island",
        "SC - South Carolina",
        "SD - South Dakota",
        "TN - Tennessee",
        "TX - Texas",
        "UT - Utah",
        "VA - Virginia",
        "VI - Virgin Islands",
        "VT - Vermont",
        "WA - Washington",
        "WI - Wisconsin",
        "WV - West Virginia",
        "WY - Wyoming",
      ],
    },
    zipCode: {
      type: String,
      validate: {
        validator: (v) => {
          /^\d{5}(?:[-\s]\d{4})?/.test(v);
        },
      },
    },
  },
  summaryObjective: {
    objective: [String],
    summary: [String],
    bluf: [String],
  },
  historyExperience: [
    {
      companyName: String,
      location: String,
      datesFrom: Date,
      datesTo: Date,
      dutiesAndTasks: [String],
    },
  ],
  technicalSkills: [
    {
      skillName: String,
      skillProficiency: {
        enum: [
          "Very Skilled",
          "Skilled Enough",
          "Adequate Skill",
          "Just Learned",
        ],
      },
      skillImportance: {
        enum: [
          "Very Important",
          "Important",
          "Medium Importance",
          "Side Hustle",
        ],
      },
    },
  ],
  softwareSkills: [
    {
      softwareName: String,
      skillProficiency: {
        enum: [
          "Very Skilled",
          "Skilled Enough",
          "Adequate Skill",
          "Just Learned",
        ],
      },
      skillImportance: {
        enum: [
          "Very Important",
          "Important",
          "Medium Importance",
          "Side Hustle",
        ],
      },
    },
  ],
  degrees: [
    {
      almaMater: String,
      degree: String,
      dateEarned: Date,
    },
  ],
  certifications: [
    {
      certName: String,
      grantedBy: String,
      dateEarned: String,
      dateExpires: String,
    },
  ],
  awardsAchievements: [
    {
      awardName: String,
      awardCompany: String,
      dateEarned: Date,
    },
  ],
  volunteering: [
    {
      orgName: String,
      tasksCompleted: [String],
      dates: [Date],
    },
  ],
});

ResumeSchema.plugin(jumblator, {  
  secret: process.env.MONGOOSE_ENCRYPT_SECRET,
});

module.exports = mongoose.model("Resume", ResumeSchema);
