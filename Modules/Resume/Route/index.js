/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com --- April 2020, Corona Times */

require("dotenv");
const router = require("express").Router();
const ResumeSchema = require("../Model");
const jwt = require("jsonwebtoken");
const UserAuth = require("../../../middleware/UserAuth");

//GETs

router.get("/get/single/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;

  ResumeSchema.findOne({ _id: resumeId })
    .then((resumeDoc) => {
      if (!resumeDoc) {
        res.sendStatus(404);
        return false;
      }
      res.status(200).json({ resumeDoc });
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.get("/get/all/", UserAuth, (req, res) => {
  const userId = req["user-id"];

  ResumeSchema.find({ "createdInfo.userId": userId })
    .then((resumeDocs) => {
      if (!resumeDocs) {
        res.sendStatus(404);
        return false;
      }
      res.status(200).json({ resumeDocs });
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.get("/get/multiple/q", UserAuth, (req, res) => {
  const resumeIds = req.query.resumeIds;

  ResumeSchema.findOne({ _id: { $in: resumeIds } })
    .then((resumeDocs) => {
      const polledResumes = [];

      resumeDocs.forEach((resume) => {
        polledResumes.push(resume._id);
      });

      const nonExistents = resumeIds.filder(
        (item) => !polledResumes.includes(item)
      );

      if (nonExistents.length > 0) {
        res.send(`Resumes ${nonExistents} do not exist!`);
        console.error(`Resumes ${nonExistents} do not exist!`);
        return false;
      }

      res.status(200).json({ resumeDoc });
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

//POSTs

router.post("/create", UserAuth, (req, res) => {
  const userId = req["user-id"];
  const resumeName = req.body.resumeName;

  if (!resumeName) {
    res.sendStatus(403);
    console.error("No name entered.");
    return false;
  }

  const resume = new ResumeSchema({
    "createdInfo.userId": userId,
    "createdInfo.resumeName": resumeName,
  });
  resume
    .save()
    .then((savedDoc) => res.status(200).json({ resumeId: savedDoc._id }))
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

//PUTs

router.put("/set/contacts/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const {
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
    city,
    state,
    zipCode,
  } = req.body;

  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !emailAddress ||
    !city ||
    !state ||
    !zipCode
  ) {
    console.error("No data entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      "contactInfo.firstName": firstName,
      "contactInfo.lastName": lastName,
      "contactInfo.phoneNumber": phoneNumber,
      "contactInfo.emailAddress": emailAddress,
      "contactInfo.city": city,
      "contactInfo.state": state,
      "contactInfo.zipCode": zipCode,
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/set/summary/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { objective, summary, bluf } = req.body;

  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!objective || !summary || !bluf) {
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        objective: objective,
        summary: summary,
        bluf: bluf,
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error("Data not entered!");
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/history/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const {
    companyName,
    location,
    datesFrom,
    datesTo,
    dutiesAndTasks,
  } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`historyExperience.${index}`]: {
          companyName: companyName,
          location: location,
          datesFrom: datesFrom,
          datesTo: datesTo,
          $push: { dutiesAndTasks: { $each: dutiesAndTasks } },
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`historyExperience.${index}`]: 1 },
        $pull: { historyExperience: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!companyName || !location || !datesFrom || !datesTo || !dutiesAndTasks) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $push: {
        historyExperience: {
          companyName: companyName,
          location: location,
          datesFrom: datesFrom,
          datesTo: datesTo,
          $push: { dutiesAndTasks: { $each: dutiesAndTasks } },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $set: {
            $push: {
              editCaptures: {
                editDate: new Date(),
                capture: oldResume,
              },
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/techskills/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { skillName, skillProficiency, skillImportance } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`technicalSkills.${index}`]: {
          skillName: skillName,
          skillProficiency: skillProficiency,
          skillImportance: skillImportance,
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`technicalSkills.${index}`]: 1 },
        $pull: { technicalSkills: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!skillName || !skillProficiency || !skillImportance) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          technicalSkills: {
            skillName: skillName,
            skillProficiency: skillProficiency,
            skillImportance: skillImportance,
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/softwareskills/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { softwareName, skillProficiency, skillImportance } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`softwareSkills.${index}`]: {
          softwareName: softwareName,
          skillProficiency: skillProficiency,
          skillImportance: skillImportance,
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`softwareSkills.${index}`]: 1 },
        $pull: { softwareSkills: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!softwareName || !skillProficiency || !skillImportance) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          softwareSkills: {
            softwareName: softwareName,
            skillProficiency: skillProficiency,
            skillImportance: skillImportance,
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/degrees/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { almaMater, degree, dateEarned } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`degrees.${index}`]: {
          almaMater: almaMater,
          degree: degree,
          dateEarned: dateEarned,
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`degrees.${index}`]: 1 },
        $pull: { degrees: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!almaMater || !degree || !dateEarned) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          degrees: {
            almaMater: almaMater,
            degree: degree,
            dateEarned: dateEarned,
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/certs/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { certName, grantedBy, dateEarned, dateExpires } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`certifications.${index}`]: {
          certName: certName,
          grantedBy: grantedBy,
          dateEarned: dateEarned,
          dateExpires: dateExpires,
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`certifications.${index}`]: 1 },
        $pull: { certifications: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!certName || !grantedBy || !dateEarned || !dateExpires) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          certifications: {
            certName: certName,
            grantedBy: grantedBy,
            dateEarned: dateEarned,
            dateExpires: dateExpires,
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/awards/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { awardName, awardCompany, dateEarned } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`awards.${index}`]: {
          awardName: awardName,
          awardCompany: awardCompany,
          dateEarned: dateEarned,
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`awards.${index}`]: 1 },
        $pull: { awards: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!awardName || !awardCompany || !dateEarned) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          awardsAchievements: {
            awardName: awardName,
            awardCompany: awardCompany,
            dateEarned: dateEarned,
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/append/volunteering/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { orgName, tasksCompleted, dates } = req.body;
  const edit = req.body.edit === "true" ? true : false;
  const del = req.body.delete === "true" ? true : false;
  const index = req.body.index;

  if (edit) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        [`volunteering.${index}`]: {
          orgName: orgName,
          $push: { tasksCompleted: { $each: tasksCompleted } },
          $push: { dates: { $each: dates } },
        },
      }
    )
      .then(() => {
        res.status(200).json({ indexUpdated: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  if (del) {
    ResumeSchema.findOneAndUpdate(
      { _id: resumeId },
      {
        $unset: { [`volunteering.${index}`]: 1 },
        $pull: { volunteering: null },
      }
    )
      .then(() => {
        res.status(200).json({ indexDeleted: index });
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    return false;
  }
  ResumeSchema.findOne({ _id: resumeId }).then((resumeDoc) => {
    if (!resumeDoc) {
      console.error("No such resume! " + resumeId);
      res.sendStatus(404);
      return false;
    }
  });

  if (!orgName || !tasksCompleted || !dates) {
    console.error("Data not entered!");
    res.sendStatus(403);
    return false;
  }

  ResumeSchema.findOneAndUpdate(
    { _id: resumeId },
    {
      $set: {
        $push: {
          volunteering: {
            orgName: orgName,
            $push: { tasksCompleted: { $each: tasksCompleted } },
            $push: { dates: { $each: dates } },
          },
        },
      },
    }
  )
    .then((oldResume) => {
      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          $push: {
            editCaptures: {
              editDate: new Date(),
              capture: oldResume,
            },
          },
        }
      ).then(() => res.status(200).json({ resumeUpdated: true }));
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.put("/restore/to/capture/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;
  const { restoreId } = req.body;

  ResumeSchema.findOne({ _id: resumeId })
    .then((resumeDoc) => {
      if (!resumeDoc) {
        console.error("No such resume! " + resumeId);
        res.sendStatus(404);
        return false;
      }

      let restoreDoc = null;

      resumeDoc.editCaptures.forEach((edit) => {        
        if (edit._id == restoreId) {          
          restoreDoc = edit.capture;
        }
      });

      if (!restoreDoc) {
        res.status(404).json({ editCaptureNotFound: true });
        return false;
      }

      ResumeSchema.findOneAndUpdate(
        { _id: resumeId },
        {
          contactInfo: restoreDoc.contactInfo,
          summaryObjective: restoreDoc.summaryObjective,
          historyExperience: restoreDoc.historyExperience,
          technicalSkills: restoreDoc.technicalSkills,
          softwareSkills: restoreDoc.softwareSkills,
          degrees: restoreDoc.degrees,
          certifications: restoreDoc.certifications,
          awardsAchievements: restoreDoc.awardsAchievements,
          volunteering: restoreDoc.volunteering,
        },
        { new: true }
      )
        .then((resumeDoc) =>
          res.status(200).json({ resumeRestored: true, resumeDoc })
        )
        .catch((e) => {
          console.error(e);
          res.sendStatus(500);
        });
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

//DELETEs

router.delete("/delete/:resumeId", UserAuth, (req, res) => {
  const resumeId = req.params.resumeId;

  ResumeSchema.findOneAndDelete({ _id: resumeId })
    .then(() => res.status(201).json({ resumeDeleted: true }))
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

module.exports = router;
