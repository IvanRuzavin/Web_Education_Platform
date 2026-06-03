const db = require("./db");

const MAX_EVALUATION_POINTS = 3;
const INITIAL_EVALUATION_POINTS = 2;

const projectMetadata = {
  arm_gpio: {
    description: "Build a practical ARM GPIO project and demonstrate digital input/output control, pin configuration, pull resistors, and safe peripheral initialization.",
    peripheral: "GPIO",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure ARM GPIO pins;Use input and output modes correctly;Validate signal behavior with a simple embedded test scenario",
    requirements: "Working project source code;Successful build and programming flow;Short explanation of the used registers or HAL calls"
  },
  arm_adc: {
    description: "Create an ARM ADC application that samples an analog signal, converts raw values into meaningful units, and explains reference voltage and resolution.",
    peripheral: "ADC",
    image_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure ADC channels;Read and scale raw conversion values;Explain sampling time and resolution trade-offs",
    requirements: "ADC acquisition demo;Measured sample output;Short defense of configuration choices"
  },
  arm_pwm: {
    description: "Implement ARM PWM generation and show how duty cycle and period control real hardware behavior such as LED brightness or motor speed.",
    peripheral: "PWM / Timer",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure timer based PWM;Calculate frequency and duty cycle;Demonstrate dynamic duty cycle changes",
    requirements: "PWM waveform or visible output;Frequency/duty calculations;Clean source code explanation"
  },
  arm_uart: {
    description: "Build an ARM UART communication task with transmit/receive handling, baud-rate configuration, and a simple command or logging protocol.",
    peripheral: "UART",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure UART parameters;Send and receive serial data;Handle communication errors or framing assumptions",
    requirements: "Working serial communication;Terminal output screenshot or demo;Explanation of baud rate settings"
  },
  arm_i2c: {
    description: "Design an ARM I2C master project that communicates with an external device and demonstrates addressing, reads, writes, and error handling.",
    peripheral: "I2C",
    image_url: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Use I2C addressing;Perform register reads and writes;Explain ACK/NACK and bus timing basics",
    requirements: "Device communication demo;Read/write transaction explanation;Basic error handling strategy"
  },
  arm_spi: {
    description: "Create an ARM SPI project and explain clock polarity, clock phase, chip select usage, and full-duplex data exchange.",
    peripheral: "SPI",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure SPI mode;Control chip select;Transfer and verify data with a peripheral",
    requirements: "SPI transaction demo;Mode and speed explanation;Readable project structure"
  },
  pic_gpio: {
    description: "Build a PIC GPIO project focused on digital pin direction, latch behavior, and reliable input/output handling.",
    peripheral: "GPIO",
    image_url: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC GPIO direction;Use input and output states;Explain latch and port behavior",
    requirements: "Working GPIO example;Short demo;Explanation of register or library usage"
  },
  pic_adc: {
    description: "Create a PIC ADC project that reads an analog input and converts it into a meaningful engineering value.",
    peripheral: "ADC",
    image_url: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC ADC;Scale raw ADC results;Understand reference voltage and resolution",
    requirements: "Analog reading demo;Conversion formula;Validated output values"
  },
  pic_pwm: {
    description: "Implement PIC PWM output and defend timer, prescaler, frequency, and duty-cycle choices.",
    peripheral: "PWM / Timer",
    image_url: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Generate PWM on PIC;Calculate frequency;Control duty cycle dynamically",
    requirements: "PWM output demo;Frequency/duty explanation;Stable firmware behavior"
  },
  pic_uart: {
    description: "Develop a PIC UART example with serial output, optional command parsing, and clear explanation of communication settings.",
    peripheral: "UART",
    image_url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure UART baud rate;Transmit and receive bytes;Explain serial frame format",
    requirements: "Working serial demo;Terminal proof;Clear configuration explanation"
  },
  pic_i2c: {
    description: "Create a PIC I2C project using a sensor or peripheral and explain address phases, data phases, and bus-level behavior.",
    peripheral: "I2C",
    image_url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Use PIC as I2C master;Read/write device registers;Explain ACK/NACK behavior",
    requirements: "I2C communication demo;Transaction explanation;Error case awareness"
  },
  pic_spi: {
    description: "Build a PIC SPI communication project and defend mode selection, chip select timing, and data verification.",
    peripheral: "SPI",
    image_url: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure SPI on PIC;Understand CPOL/CPHA;Exchange data with a device",
    requirements: "SPI communication demo;Mode explanation;Validated received data"
  },
  pic32_gpio: {
    description: "Master PIC32 GPIO by creating a project that demonstrates pin configuration, input reading, and output control.",
    peripheral: "GPIO",
    image_url: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC32 GPIO;Use digital input and output safely;Explain initialization flow",
    requirements: "Working demo;Pin configuration explanation;Clean source organization"
  },
  pic32_adc: {
    description: "Implement a PIC32 ADC project and demonstrate analog sampling, scaling, and result presentation.",
    peripheral: "ADC",
    image_url: "https://images.unsplash.com/photo-1581092335397-9fa341108b97?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC32 ADC;Convert raw readings;Explain sampling and reference voltage",
    requirements: "ADC reading demo;Formula explanation;Validated measured values"
  },
  pic32_pwm: {
    description: "Create a PIC32 PWM application and explain timer configuration, duty cycle, and output frequency.",
    peripheral: "PWM / Timer",
    image_url: "https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Generate PWM with PIC32 timers;Calculate timing;Adjust duty cycle during runtime",
    requirements: "PWM output demo;Timing calculation;Runtime control explanation"
  },
  pic32_uart: {
    description: "Build a PIC32 UART project and defend configuration, serial protocol behavior, and data handling.",
    peripheral: "UART",
    image_url: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC32 UART;Transmit and receive data;Explain baud and framing settings",
    requirements: "Working UART demo;Terminal proof;Communication setting explanation"
  },
  pic32_i2c: {
    description: "Create a PIC32 I2C project using a peripheral device and explain bus transactions and status handling.",
    peripheral: "I2C",
    image_url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC32 I2C master;Perform device register access;Handle bus result states",
    requirements: "I2C device demo;Read/write explanation;Basic error handling"
  },
  pic32_spi: {
    description: "Implement PIC32 SPI communication and explain clock configuration, chip select, and data validation.",
    peripheral: "SPI",
    image_url: "https://images.unsplash.com/photo-1614064642261-3ccbfafa481b?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure PIC32 SPI;Understand mode settings;Validate exchanged data",
    requirements: "SPI transaction demo;Configuration explanation;Reliable data output"
  },
  riscv_gpio: {
    description: "Build a RISC-V GPIO project and demonstrate digital pin setup, toggling, input reading, and board-level validation.",
    peripheral: "GPIO",
    image_url: "https://images.unsplash.com/photo-1590496070188-725a9ce5800d?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure RISC-V GPIO;Control digital outputs;Read and validate inputs",
    requirements: "Working GPIO firmware;Visible output or captured signal;Configuration explanation"
  },
  riscv_adc: {
    description: "Create a RISC-V ADC project that samples analog data and explains scaling, reference voltage, and accuracy limitations.",
    peripheral: "ADC",
    image_url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure ADC acquisition;Scale raw values;Explain reference and resolution",
    requirements: "ADC measurement demo;Conversion explanation;Output validation"
  },
  riscv_pwm: {
    description: "Implement RISC-V PWM generation and defend timer configuration, output frequency, and duty-cycle control.",
    peripheral: "PWM / Timer",
    image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Generate PWM on RISC-V;Calculate timer values;Control duty cycle dynamically",
    requirements: "PWM demo;Timing explanation;Stable firmware behavior"
  },
  riscv_uart: {
    description: "Develop a RISC-V UART project with serial communication, logging, and a short protocol or command demonstration.",
    peripheral: "UART",
    image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure UART;Send and receive serial data;Explain frame and baud settings",
    requirements: "Working serial communication;Terminal output;Configuration explanation"
  },
  riscv_i2c: {
    description: "Create a RISC-V I2C project that communicates with a device and explains addressing, transaction sequence, and error cases.",
    peripheral: "I2C",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure I2C master;Perform device register reads/writes;Explain ACK/NACK behavior",
    requirements: "I2C device demo;Transaction explanation;Basic error handling"
  },
  riscv_spi: {
    description: "Build a RISC-V SPI communication project and demonstrate mode selection, chip select handling, and data exchange validation.",
    peripheral: "SPI",
    image_url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80",
    pdf_url: "https://www.mikroe.com/ebooks/",
    learning_goals: "Configure SPI;Understand CPOL and CPHA;Validate exchanged data",
    requirements: "SPI communication demo;Mode explanation;Clear result verification"
  }
};

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const ensureColumn = async (table, column, definition) => {
  const columns = await all(`PRAGMA table_info(${table})`);
  if (!columns.some((item) => item.name === column)) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};

const initialize = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS Users(
      uid TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      experience INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      rank TEXT NOT NULL DEFAULT 'Student',
      avatar TEXT NOT NULL,
      email TEXT,
      birthplace TEXT,
      phone TEXT,
      is_online INTEGER NOT NULL DEFAULT 0,
      status TEXT,
      evaluation_points INTEGER NOT NULL DEFAULT ${INITIAL_EVALUATION_POINTS},
      ready_for_evaluation INTEGER NOT NULL DEFAULT 0,
      ready_for_evaluation_since TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Projects(
      project_id TEXT PRIMARY KEY,
      complexity INTEGER,
      project_name TEXT NOT NULL,
      description TEXT,
      peripheral TEXT,
      image_url TEXT,
      pdf_url TEXT,
      learning_goals TEXT,
      requirements TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS UserToProject(
      user_id TEXT,
      project_id TEXT,
      score INTEGER,
      PRIMARY KEY(user_id, project_id),
      FOREIGN KEY(user_id) REFERENCES Users(uid),
      FOREIGN KEY(project_id) REFERENCES Projects(project_id)
    )
  `);

  await run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_UserToProject_user_project
    ON UserToProject(user_id, project_id)
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Evaluations(
      evaluation_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      evaluated_user_id TEXT NOT NULL,
      evaluator_user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      score INTEGER,
      feedback TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      FOREIGN KEY(project_id) REFERENCES Projects(project_id),
      FOREIGN KEY(evaluated_user_id) REFERENCES Users(uid),
      FOREIGN KEY(evaluator_user_id) REFERENCES Users(uid)
    )
  `);

  await ensureColumn("Users", "evaluation_points", `INTEGER NOT NULL DEFAULT ${INITIAL_EVALUATION_POINTS}`);
  await ensureColumn("Users", "ready_for_evaluation", "INTEGER NOT NULL DEFAULT 0");
  await ensureColumn("Users", "ready_for_evaluation_since", "TEXT");

  await ensureColumn("Projects", "description", "TEXT");
  await ensureColumn("Projects", "peripheral", "TEXT");
  await ensureColumn("Projects", "image_url", "TEXT");
  await ensureColumn("Projects", "pdf_url", "TEXT");
  await ensureColumn("Projects", "learning_goals", "TEXT");
  await ensureColumn("Projects", "requirements", "TEXT");

  await run(
    `UPDATE Users
     SET evaluation_points = ${INITIAL_EVALUATION_POINTS}
     WHERE evaluation_points IS NULL`
  );

  await run(
    `UPDATE Users
     SET evaluation_points = ${MAX_EVALUATION_POINTS}
     WHERE evaluation_points > ${MAX_EVALUATION_POINTS}`
  );

  for (const [projectId, meta] of Object.entries(projectMetadata)) {
    await run(
      `UPDATE Projects
       SET description = COALESCE(NULLIF(description, ''), ?),
           peripheral = COALESCE(NULLIF(peripheral, ''), ?),
           image_url = COALESCE(NULLIF(image_url, ''), ?),
           pdf_url = COALESCE(NULLIF(pdf_url, ''), ?),
           learning_goals = COALESCE(NULLIF(learning_goals, ''), ?),
           requirements = COALESCE(NULLIF(requirements, ''), ?)
       WHERE project_id = ?`,
      [
        meta.description,
        meta.peripheral,
        meta.image_url,
        meta.pdf_url,
        meta.learning_goals,
        meta.requirements,
        projectId
      ]
    );
  }
};

const ready = initialize()
  .then(() => console.log("Database initialized"))
  .catch((err) => {
    console.error("Database initialization failed", err);
    throw err;
  });

module.exports = ready;
