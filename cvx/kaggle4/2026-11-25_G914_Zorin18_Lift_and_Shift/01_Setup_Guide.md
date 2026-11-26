# From Windows to the PowerSpec G914 on Zorin OS 18: a lift-and-shift guide for the Kaggle Gemma 4 Developer Agent competition

*Prepared 2026-11-25. Written for you, as an experienced Windows developer who is new to Linux. It assumes nothing about Linux and nothing about this particular machine beyond what is on its spec sheet.*

## 0. How to use this guide

### 0.1 What "done" looks like

At the end you have a machine that boots into either Windows 11 or Zorin OS 18, and in Zorin: your familiar tools (Visual Studio Code, the Claude Code extension, your Claude Code settings, rules, skills and memories), your research toolkit, the BCF brain packages, and a working local copy of the competition's test harness with the model served from the RTX 5090. From there you can run the naive-versus-BCF live test, measure results, improve the brain and submit.

### 0.2 The route in one table

| Part | What you do | Time | Needs the internet | Needs you, not an agent |
|---|---|---|---|---|
| A | Install Zorin OS 18 next to Windows (dual boot) | 2 to 3 hours, plus any BitLocker decryption | Yes | Yes: USB stick, firmware menus, installer |
| B | Learn the twenty Linux habits that matter | 20 minutes of reading, then as you go | No | Reading |
| C | Carry your work over with the lift-and-shift package and run its installer | 30 to 60 minutes | Yes | Yes: a terminal, your sudo password |
| D | Set up VS Code and the Claude Code extension, put in your keys | 20 minutes | Yes | Yes: signing in |
| E | Hand the rest to Claude Code with the kickoff prompts | Minutes to paste | Yes | Pasting prompts, approving steps |
| F | What Claude Code does next: harness, data, model, live run | 3 to 6 hours, mostly downloads | Yes | A Kaggle token, approvals |
| G | Six walks through real days of work | Reading | No | Reading |
| H | Troubleshooting, a printable checklist, sources | Reference | No | Reference |

### 0.3 What was verified, and what was not

| Statement | Status |
|---|---|
| Every install command in the installer and in this guide comes from the official documentation of the tool it installs: Zorin's help centre, Microsoft Learn, Ubuntu's documentation, the VS Code, Claude Code, uv, NodeSource, GitHub CLI and Docker documentation | Checked against those pages on 2026-11-25; the links are in section H.3 |
| The installer script | Syntax-checked, linted with shellcheck, its three embedded Python snippets unit-tested, dry-run against a simulated Zorin OS 18.1, and **run to the end three times in a real Ubuntu 24.04 container**: every stage passed each time. **Not run on Zorin itself**, because the G914 is still factory-fresh. Section H.4 has the record |
| The two zips | Integrity-checked: every file's SHA-256 matches the manifest, scripts carry Linux permissions and Linux line endings, and the main zip contains no secret |
| The competition facts (budgets, harness behaviour, deadlines) | Read from the data package, the harness source and your earlier packages, which record their own verification |
| The exact wording of Windows menus for BitLocker and device encryption | Not re-checked against Microsoft's support pages during this run. If a menu is named slightly differently on your machine, search for "BitLocker" in the Settings app |

### 0.4 How to read the marked blocks

| Mark | Meaning |
|---|---|
| **Do this.** | A concrete action |
| **Rookie mistake.** | Something almost every Windows user does once. Avoiding it costs a minute; fixing it can cost an evening |
| **Why it works this way.** | The idea behind a Linux or Windows behaviour, in plain words |
| **If it goes wrong.** | The recovery path. Nothing in this guide is irreversible if you made the backup in section A, step 1 |
| **Tip.** | A habit that saves time later |

### 0.5 Five words you will meet constantly

| Word | Plain meaning |
|---|---|
| Terminal | A window where you type commands to the computer. Windows people know it as the command prompt or PowerShell. In Zorin it is called Terminal |
| `sudo` | "Do this as the administrator." Linux keeps you as an ordinary user by default, which is why Linux machines rarely get crippled by one bad click. You type your password, nothing appears on screen while you type it, and that is normal |
| Package | One program, bundled for installation. Linux programs normally arrive from a repository, which is an app store run by the people who build your system |
| Home folder, written `~` | Your personal folder, `/home/yourname`. It is where everything of yours lives. There are no drive letters |
| Distribution | A complete Linux system built from shared parts. Ubuntu is one; Zorin OS is built on Ubuntu (Zorin's own words: "built on Ubuntu and Linux"), so everything written for Ubuntu 24.04 applies to Zorin 18 |

---

---

## A. Dual boot: Zorin OS 18 beside Windows 11 on the G914

### A.0 What "dual boot" means, and what it does to your machine

Dual boot means two operating systems live on one disk. A small menu appears every time you power on. You pick Zorin or Windows, and each one leaves the other alone. Your Windows files stay where they are.

Three things change, and nothing else does:

| What changes | How | What you would notice |
|---|---|---|
| The disk gains new partitions | You make room by shrinking the Windows partition, and the installer fills that room | Windows has less free space. That is all |
| A start menu is installed | The installer puts a boot menu (its name is GRUB) in its place | Each power-on asks: Zorin or Windows. It picks for you after a few seconds |
| The firmware may lose one setting | Secure Boot is switched off only if the NVIDIA driver refuses to load with it on | Nothing in daily use |

**Rookie mistake.** Treating the installer as the risky part. On this machine the risky parts are the two hours before it: an encrypted Windows disk and a recovery key nobody saved. Step 1 exists for that reason.

### A.1 The machine as it leaves the factory

| Part | What the G914 has | Why it matters here |
|---|---|---|
| Operating system | Windows 11 Pro | Pro includes the full BitLocker tools, so you get two ways to manage encryption |
| Processor | AMD Ryzen 9 9950X3D | 16 cores, 32 threads. Fast enough for everything in this guide |
| Graphics | NVIDIA GeForce RTX 5090 with 32 GB | The reason for the whole move. It needs the newest driver line and, as section A.11 explains, a particular flavour of it |
| Memory | 64 GB DDR5-6000 | Plenty for serving the model and running the harness together |
| Disk | One 2 TB NVMe solid-state drive | It will hold both systems |
| Motherboard | MSI MAG X870E Tomahawk WiFi | Its keys for the firmware and the boot menu are in step A.6 |
| Network | 5 Gb Ethernet, Wi-Fi 7, Bluetooth 5.4 | A cable is the steadier choice for the 40 GB of downloads in section F |

Source: the product pages of PowerSpec and Micro Center, listed in section H.3.

### A.2 The whole thing on one page

Read this once before you start, so you know where you are going. Each row is one step of this section.

| Step | What you do | Where | Time, about | Can be undone? |
|---|---|---|---|---|
| A.4 | Update Windows, back up, find the recovery key | Windows | 40 to 90 minutes, mostly waiting | Nothing to undo |
| A.5 | Turn device encryption off for now, and Fast Startup off for good | Windows | 10 minutes, plus decryption | Yes: one switch puts encryption back (step A.12) |
| A.6 | Shrink the Windows partition | Windows | 5 minutes | Yes, until Zorin is installed |
| A.7 | Download Zorin OS 18.1 and check its checksum | Windows | 20 to 60 minutes | Delete the file |
| A.8 | Write it to a USB stick | Windows | 10 minutes | Reformat the stick |
| A.9 | Look at the firmware settings once | Firmware menu | 5 minutes | Note the old values, then put them back |
| A.10 | Boot from the stick and run the installer | Zorin installer | 20 to 40 minutes | Only by removing Zorin's partition later |
| A.11 | First boot: boot menu, NVIDIA driver, updates, clock | Zorin | 30 to 60 minutes | Nothing to undo |
| A.12 | Make it yours, set up backups, put encryption back on | Zorin, then Windows | 20 minutes | Yes |

The times are estimates from experience with machines of this class, not measurements on this model.

### A.3 What you need

| Item | Requirement | Note |
|---|---|---|
| The G914, set up once | Windows works and you can sign in | You need an administrator account on it |
| A USB stick | 4 GB or more | Everything on it is erased. Use a spare |
| A second place to keep files | An external drive, a phone, a cloud drive | For the recovery key and the two zips of the lift-and-shift package |
| Another device with a browser | Your old workstation or a phone | To look up the recovery key without the PC being on |
| An Ethernet cable, if your router is near | Any | The installer can download updates while it works |
| A camera | Your phone | One photo of the firmware screens saves an evening |

Zorin's own minimum for the system is modest: a 1 GHz dual-core 64-bit processor, 2 GB of memory, 15 GB of storage and an 800 by 600 display. The G914 passes by a wide margin.

### A.4 Step 1: update Windows, back up, and find the recovery key

Do all of this in Windows before you change anything.

#### A.4.1 Run Windows Update until it has nothing left

Open Settings, choose Windows Update, and select Check for updates. Restart when asked, and repeat until it reports that you are up to date.

**Why it works this way.** Some Windows updates enlarge the small recovery partition at the end of the Windows area. Microsoft's notes for those updates say the PC must have 250 MB of free space in the recovery partition. While Windows is the last thing on the disk, it can take that space. After Zorin sits next to it, it cannot. Doing the updates now removes that problem for good.

#### A.4.2 Copy anything you would hate to lose to another drive

Zorin's installation guide puts it plainly: "Installing a new operating system may overwrite your data." On a machine that arrived last week there is little to copy, which makes this the cheapest backup of your life. Do it anyway.

#### A.4.3 Find out whether the disk is encrypted

This is the step that matters most. Windows 11 turns on device encryption by itself the first time a PC like this one is set up with a Microsoft account. Microsoft's description: "When you first sign in or set up a device with a Microsoft account, or work or school account, Device Encryption is turned on and a recovery key is attached to that account."

Check in two places:

| Where | How to open it | What you see if encryption is on |
|---|---|---|
| Settings | Settings, then Privacy and security, then Device encryption | A switch that is On. If the entry is missing, the feature is not available on this device or you are signed in with a standard account |
| Manage BitLocker (Windows 11 Pro) | Select Start, type BitLocker, open Manage BitLocker | Windows (C:) with "BitLocker on" and a "Back up your recovery key" link |
| A command | Select Start, type cmd, right-click Command Prompt, choose Run as administrator, then enter `manage-bde -status C:` | A line "Conversion Status: Fully Encrypted" and "Percentage Encrypted: 100.0%" |

If all three say the disk is not encrypted, skip to A.4.6.

**Rookie mistake.** Assuming the disk is not encrypted because you never asked for it. Almost every new Windows 11 PC is encrypted before its owner notices.

#### A.4.4 Save the recovery key in two places that are not this computer

The key is a 48-digit number. Without it, a Windows that decides to lock itself cannot be unlocked, and Microsoft is clear about what that means: "If you can't find the BitLocker recovery key and are unable to undo any changes that caused it to be needed, you'll have to reset your device", which removes your files.

| Route | Steps | Good for |
|---|---|---|
| Your Microsoft account | On another device open `https://aka.ms/myrecoverykey` and sign in with the account you use on the PC | The usual place. The key is normally there already |
| Manage BitLocker | Open Manage BitLocker as above, choose Back up your recovery key next to the C: drive, and pick Save to a file or Print the recovery key | A second copy that does not depend on an account |
| Your phone | Photograph the screen or the printout | The copy you can reach when the PC is asking for the key |

A password manager is a good second home for the key. Note the key ID shown beside it: if you ever own more than one encrypted PC, the recovery screen shows the first digits of the one it wants.

**If it goes wrong.** You cannot find a key and the disk is encrypted. Stop here. Do not shrink, install or change firmware settings. Copy your files off the machine first (they are readable while Windows starts normally), and only then continue.

#### A.4.5 Why this key matters so much for a dual boot

Microsoft lists what makes Windows ask for it: "Changes to the NTFS partition table on the disk", "Changes to the boot manager", and "Changing the BIOS boot order to boot another drive in advance of the hard drive." Installing Zorin does all three. That is not a fault. It is the lock doing its job.

#### A.4.6 Keep a note of what you found

On paper or in your phone: the recovery key, whether encryption was on, and how much free space the disk had.

### A.5 Step 2: turn device encryption off for now, and Fast Startup off for good

#### A.5.1 Turn device encryption off

This is the simplest safe route and it is the one this guide recommends: nothing can lock Windows while the disk is unencrypted.

| Your Windows | Steps |
|---|---|
| Device encryption switch | Settings, Privacy and security, Device encryption, switch it Off, and confirm |
| Manage BitLocker | Open Manage BitLocker, choose Turn off BitLocker next to Windows (C:), and confirm |

Windows decrypts in the background. You can keep using the PC. To see how far it has got, run `manage-bde -status C:` again and read "Percentage Encrypted". Wait for "Fully Decrypted" and 0.0% before step A.6. If the PC restarts or loses power halfway, Microsoft says the work resumes where it stopped the next time Windows starts. On a nearly new disk this takes minutes; on a full one, longer.

**Why turn it off rather than leave it on.** Three reasons, in order of weight:

| Reason | Evidence |
|---|---|
| The Zorin installer will not place Zorin beside an encrypted Windows | Zorin's forum has several reports of the installer stopping when it detects BitLocker, from users who had never switched it on themselves |
| With it on, the first Windows boot after the install very likely stops at the recovery screen | Microsoft's list of what triggers recovery (step A.4.5) |
| You may have to switch Secure Boot off for the graphics driver, which is another trigger | Zorin: "you may need to first disable your computer's Secure Boot feature to enable the NVIDIA drivers fully" |

You switch encryption back on in step A.11, once everything is in its final state.

**If you would rather keep it on.** It can be done, and experienced users do it. Suspend protection in Manage BitLocker before you start, keep the printed key next to you, and expect to type it once. Know that Windows resumes protection at its next restart unless you set a restart count, so read step A.4.5 again before you rely on it.

#### A.5.2 Switch Fast Startup off

It is a Windows feature that speeds up start-up by saving a half-hibernated state on the disk. A second operating system then finds the Windows partition in a state it cannot safely use. Zorin's advice for installation problems on modern computers is to switch it off: "These features are designed for Windows-only computers, and disabling them shouldn't affect the performance of Zorin OS."

Zorin's steps:

1. Open the Search tool in the taskbar.
2. Type Control Panel and open the Control Panel app.
3. Go to System and Security, then Power Options.
4. In the left sidebar, select Choose what the power buttons do.
5. Select Change settings that are currently unavailable.
6. Under Shutdown settings, untick Turn on fast startup.
7. Select Save changes.

The same result from an administrator Command Prompt, in one line, if the checkbox is missing or greyed out:

```bat
powercfg /hibernate off
```

It disables hibernation, and Fast Startup depends on the hibernation file. On a desktop that is no loss. `powercfg /hibernate on` reverses it.

### A.6 Step 3: make room by shrinking the Windows partition

You shrink Windows while Windows is running, with Windows's own tool. That is the careful way: Zorin's installer never has to touch the Windows partition.

#### A.6.1 Decide how much to give Zorin

The disk shows as roughly 1,862 GB in Windows. Windows itself uses about 120 GB.

Everything heavy in this project lives in Zorin. For scale: the competition data is 22 GB as a download, the main model is 17 to 18 GB, the serving software with PyTorch is around 10 GB once installed, and the sandbox image for the harness is a few more.

| Plan | Shrink by this many MB | Zorin gets, about | Windows keeps, about | Choose it if |
|---|---|---|---|---|
| Lean | 400,000 | 390 GB | 1,470 GB | You want one model and no container sandbox |
| Recommended | 1,100,000 | 1,070 GB | 790 GB | This competition: two models, experiments, a sandbox image, results |
| Maximum | 1,600,000 | 1,560 GB | 290 GB | Windows is only a fallback system |

The "MB" in this dialog are binary megabytes, which is why 1,100,000 comes to slightly more than a terabyte.

**Tip.** Changing your mind later is painful in both directions. Take the Recommended row unless you are sure.

#### A.6.2 Shrink

1. Right-click the Start button and choose Disk Management. Wait for the picture of the disk to load.
2. Find the largest block, labelled with the letter C: and the description of your Windows volume.
3. Right-click that block and choose Shrink Volume. Wait for the dialog that asks how much.
4. In "Enter the amount of space to shrink in MB", type your number from the table.
5. Select Shrink. A new black block labelled Unallocated appears to the right of C:.

**Rookie mistake.** Right-clicking the wrong block. The C: volume is the large one. The small blocks before and after it are labelled EFI System Partition and Recovery. Microsoft's advice for those: "The recommended practice is to not modify these partitions in any way."

**If the largest number the dialog offers is far smaller than you asked for.** Windows cannot move certain files, so it stops at them. Microsoft's page on shrinking names the page file and the shadow-copy storage as the usual blockers. Try these in order:

| Try | What to do | Why it helps |
|---|---|---|
| 1 | Restart the PC from the Start menu (restart, not shut down) and try again | A fresh start clears what the last session left in place |
| 2 | Check that step A.5.2 was done, then restart and try again | The hibernation file is one of the large files that cannot be moved |
| 3 | Run Disk Cleanup, select Clean up system files, and remove old update files and restore points | Restore points live in the shadow-copy storage |
| 4 | Accept the smaller number, or look up Event ID 259 in the Application log | Microsoft's page says that event names the file that is blocking |

Whatever you get, Zorin needs at least 250 GB for this project to be comfortable.

**Optional: a lettered drive both systems can use.** If you want a place that Windows and Zorin can both write to, create it now, while you are still in Disk Management. Right-click the Unallocated block, choose New Simple Volume, give it a size such as 100,000 MB, assign the letter D:, and format it as NTFS. Zorin reads and writes NTFS. Windows cannot read Zorin's own partition, so this shared drive is the easy route for handing files from Zorin back to Windows. Leave the rest unallocated for Zorin.

### A.7 Step 4: download Zorin OS 18.1 and check it

#### A.7.1 Download

Open `https://zorin.com/os/download`. Zorin OS 18.1 Core is the free edition. Select Download under it. A newsletter box appears first; choose Skip to download. Keep the file, which ends in `.iso`, in your Downloads folder. Zorin asks that you do not use a third-party download manager, and that you use a current browser.

**Why Core.** It is free, and it is the same system underneath. The paid Pro edition adds desktop layouts and pre-installed creative apps. Nothing in this guide needs them.

#### A.7.2 Check that the download is intact

A damaged image is the cause of many failed installs. Zorin publishes a SHA-256 checksum for each image and recommends comparing yours with it.

The checksum Zorin published for Zorin OS 18.1 Core 64-bit when this guide was written:

```text
44649b97bd307fc4c8529205d098ebbf98575a1e1ba2ee7d7005b697af1721d5
```

Open the page in section H.3 called "Check the Integrity of Your Copy of Zorin OS" on the day you download, and compare with what it shows then.

Zorin's article describes a small app called QuickHash. Windows can do the same with no download. Right-click the Start button, open Terminal or PowerShell, and type the command below, then drag the `.iso` file from Downloads into the window to fill in its path:

```powershell
Get-FileHash -Path "C:\Users\<you>\Downloads\<the file you downloaded>.iso" -Algorithm SHA256
```

The result is printed in capital letters. Letter case does not matter. If the two strings differ, download again.

### A.8 Step 5: write Zorin to the USB stick

Zorin's guide uses an app called balenaEtcher. The PC you do this on can be any PC.

**Rookie mistake.** Leaving family photos on the stick you are about to use. Everything on it is erased.

1. Download balenaEtcher from `https://etcher.balena.io` and open it.
2. Plug the USB stick in.
3. Select Flash from file and choose the `.iso` file in Downloads.
4. Select target and pick the USB stick.
5. Select Flash! and wait for the message that it is done.

Rufus is the alternative Zorin lists for Windows, if you already know it. The settings that matter in either app are the same three: the image, the stick, and nothing else.

### A.9 Step 6: look at the firmware settings once

The firmware, also called BIOS or UEFI, is the small program that runs before any operating system. You will probably visit it twice: once now to look, and once more only if something in step A.10 needs a change.

#### A.9.1 Three ways in

| Way | How | Use it when |
|---|---|---|
| From Windows | Hold Shift while selecting Restart on the Start menu. Then Troubleshoot, Advanced options, UEFI Firmware Settings | You are in Windows and want the reliable route. This is Microsoft's own instruction |
| From a command | In an administrator Command Prompt enter `shutdown /r /fw /t 0` | The same thing, typed |
| At power-on | Switch on and tap Delete repeatedly as the MSI logo appears | Windows is not starting |

On this machine the third way follows from its MSI motherboard. MSI's FAQ says to "press the Delete key as soon as the MSI logo appears to enter BIOS Setup", and that F10 saves the settings and restarts. PowerSpec publishes no key of its own that this guide could find, so trust the first screen you see over this table.

#### A.9.2 What to look at

Use the arrow keys. A mouse usually works too.

| Setting | Where it usually is | What to do | Why |
|---|---|---|---|
| Fast Boot | Boot | Switch it off | Zorin: it is built for Windows-only PCs and causes installation problems on many modern ones |
| Secure Boot | Boot or Security | Leave it on for now | Zorin: "Zorin OS should work normally when the Secure Boot feature is enabled on most modern computers" |
| Boot order | Boot | Change nothing yet | The Zorin installer adds its own entry |
| Anything called CSM, Legacy or Compatibility Support Mode | Boot | Leave it exactly as it is | Windows 11 needs the native UEFI mode. Changing this is how people make a PC that starts nothing |

**Tip.** Photograph every page before you change a setting. The photos are your way back.

**Rookie mistake.** "Tidying up" other pages of the firmware. Nothing there needs you today.

Select the save-and-exit option, which is F10 on MSI boards and is shown at the edge of the screen on most others. If you changed only Fast Boot, confirm the save. If you only looked, choose discard changes.

### A.10 Step 7: boot from the stick and run the installer

#### A.10.1 Boot from the USB stick

1. Switch the PC off from the Start menu. Zorin: "Make sure it's completely powered off, and not in sleep or hibernate mode." With Fast Startup off in step A.5.2, a shut down is a real shut down.
2. Plug in the stick, and the Ethernet cable if you use one.
3. Switch on and tap F11 repeatedly. MSI's FAQ for its boards: "Press F11 can display boot menu on the screen." If nothing appears, power off and use Delete to enter the firmware, then put the USB entry first in the boot order.
4. In the menu, pick the entry that mentions "USB" or "EFI" or the stick's brand name, and press Enter.
5. Zorin's own menu appears. Press the down arrow until **Try or Install Zorin OS (modern NVIDIA drivers)** is selected, then press Enter. Zorin gives this option for cards made after 2013, and the RTX 5090 is one.
6. Let the check of the stick finish. Zorin's advice is not to skip it the first time. It is your proof that steps A.7 and A.8 worked.

After a minute or two you are on the Zorin desktop, running from the stick. It runs slower there than it will from the disk. Look around: nothing is installed yet, and nothing you do now is kept.

**If it goes wrong.** See the table at the end of this section.

#### A.10.2 The installer, screen by screen

Open the installer and follow the screens.

| Screen | What to choose | Why |
|---|---|---|
| Language and keyboard | Yours | |
| Wi-Fi, if you use it | Your network | Zorin asks you to connect to the internet during installation so that it can download what it needs |
| Updates and other software | Tick Install third-party software for graphics and Wi-Fi hardware and additional media formats | Zorin's NVIDIA guide requires it for the driver to be installed |
| Installation type | **Install Zorin OS alongside Windows Boot Manager** | This is the dual-boot choice. It uses the free space you made in step A.6 |
| How much space | Accept what it offers | It can only use space not already given to Windows |
| Ready to install | Select Install Now, then confirm "Write the changes to disks?" | This is the point of no return for the disk |
| Where are you and who are you | Your time zone, your name, a user name, and a password | See the note on the password below |
| Installation complete | Restart Now. Remove the stick when asked | Otherwise the PC boots from the stick again |

**Rookie mistake.** Choosing **Erase disk and install Zorin OS**. On this machine that erases Windows and everything on it. Read the Installation type screen twice.

**Rookie mistake.** A blank or trivial password. This account can install software with `sudo`, and this machine will hold your keys. Choose a strong one. Tick "Log in automatically" only if the PC sits in a locked room.

**If "Install Zorin OS alongside Windows Boot Manager" is not offered.** Zorin's guide says this can happen when the PC has several drives or an unusual layout, and points to manual partitioning:

| In the list of partitions | What to do |
|---|---|
| The ntfs partition that holds Windows, and the small EFI and Recovery partitions | Select none of them. Format none of them |
| The "free space" you made in step A.6 | Select it, then press the plus button |
| In the dialog | Size: leave a little if you made a shared drive and want more room, otherwise all of it. Type for the new partition: Primary. Location for the new partition: Beginning. Use as: Ext4 journaling file system. Mount point: a single slash |
| Device for boot loader installation | Leave it as it is on a one-drive PC. Zorin: the default "should be correct". With two drives, pick the whole drive that holds the new partition, never a single partition on it |
| Then | Install Now, and confirm the changes |

The manual route was not exercised for this guide. Take the offered "alongside" option if you see it.

### A.11 Step 8: first boot in Zorin: the menu, the NVIDIA driver, updates, the clock

#### A.11.1 The start menu

The PC now shows a menu with Zorin first and "Windows Boot Manager" below it. The arrow keys choose and Enter starts. Left alone, it starts Zorin after a few seconds.

**If Windows stops at a blue screen asking for a BitLocker recovery key.** You turned encryption off in step A.5.1, so this should not happen. If it does, enter the 48 digits you saved in step A.4.4. Nothing is lost. Then check in Windows that encryption is fully off.

#### A.11.2 Check that the graphics driver is active

This matters more than anything else on this machine.

Zorin's way to check:

1. Open the Zorin Menu, then Settings.
2. Select System at the bottom of the left sidebar, then About.
3. Select System Details.
4. Look at the line called Graphics. It should mention NVIDIA.

Or, in a Terminal (Zorin Menu, Utilities, Terminal), enter:

```bash
nvidia-smi
```

The first line of the table should name the RTX 5090 and a driver version that starts with 580. Zorin's installer option uses "the NVIDIA version 580 proprietary drivers".

#### A.11.3 If the driver is not active

Follow Zorin's instructions for a PC that already has Zorin:

1. Make sure the PC is online.
2. Open the Zorin Menu, then System Tools, then Software Updater.
3. When it has finished checking for updates, select Settings.
4. Open the Additional Drivers tab and wait for the list.
5. Select the radio button beside the newest driver for the graphics card, and not a "Server" version.
6. Select Apply Changes and wait.
7. Restart the PC and repeat step A.11.2.

**Read this before you pick in that list.** Zorin's general tip on that page is to pick a driver marked "(proprietary)" and avoid names ending in "-open". For this graphics card do the opposite. NVIDIA's own manual for the 580 driver says: "The proprietary flavor supports the GPU architectures Maxwell, Pascal, Volta, Turing, and later GPUs until Blackwell. Blackwell and later are only supported by the open kernel modules." The RTX 5090 is a Blackwell card. So if the list offers you a choice, take the variant whose name ends in **-open**. NVIDIA adds that the two kinds "should not be installed on the filesystem at the same time".

Still not active? Two more things from Zorin's page, in order:

| Try | How |
|---|---|
| Use the Xorg session | Log out. At the login screen select your user name, select the gear icon at the bottom right, and pick "Zorin Desktop on Xorg". Log in again |
| Switch Secure Boot off | Power off and on, tap Delete to enter the firmware, find Secure Boot under Boot or Security, set it to disabled, and save with F10 |

You photographed these pages in step A.9.2, so you can restore them later.

#### A.11.4 Install the updates

Open Software Updater again and install everything it offers. Restart if it asks.

#### A.11.5 Fix the clock

After a dual boot you may find the Zorin clock some hours off. Zorin explains it: Zorin keeps the hardware clock in universal time and Windows keeps it in local time. Zorin's fix, run in a Terminal:

```bash
sudo timedatectl set-local-rtc 1 --adjust-system-clock
```

It asks for your password. Nothing appears on the screen as you type it, which is normal on Linux. Then restart into Windows, check that its clock is right in Date and time settings, and restart into Zorin.

#### A.11.6 Look at the disk from Zorin

Open the Files app and select Other Locations. The Windows partition is there and can be opened. Zorin: "If you install Zorin OS alongside Windows, you can access the files on your Windows drive partition from within Zorin OS."

### A.12 Step 9: make it feel like home, and protect yourself

#### A.12.1 The layout

Zorin is built to look familiar. Its site puts it this way: "The Zorin Appearance app lets you change the desktop layout to feel like the environment you're familiar with, whether it's Windows, macOS, or Linux." Open the Zorin Menu, select Zorin Appearance, and try the layouts. The free Core edition ships with four. Two more Windows-styled ones, called Windows 11 and Windows Classic, belong to the paid Pro edition.

#### A.12.2 Fonts for your documents

Zorin's help centre has a one-page article called Microsoft Fonts, linked in section H.3, for making documents look as they did in Windows.

#### A.12.3 Set up backups now, not later

Zorin ships a Backups app.

1. Open the Zorin Menu, then Utilities, then Backups.
2. It backs up your whole Home folder by default. Leave that.
3. On the Storage location page choose where copies go: a local drive such as the shared one from step A.6, a network drive, or Google Drive.
4. Select Scheduling in the left list and switch on Automatic backup. Pick a time when the destination will be attached.

Zorin's own policy is worth copying: keep important data "in at least 3 places: Two on-site copies. One off-site copy." For code, a private GitHub repository is the off-site copy that costs least. Section D covers signing in to GitHub.

**Why it works this way.** Windows users rely on System Restore. Zorin's equivalent protection is a copy of your files, plus the fact that the system itself can be reinstalled in half an hour.

#### A.12.4 Put device encryption back on

Restart into Windows and run `manage-bde -status C:`. If you turned encryption off in step A.5.1, turn it back on now, while the firmware and boot setup are in their final state:

| Your Windows | Steps |
|---|---|
| Device encryption switch | Settings, Privacy and security, Device encryption, switch it On |
| Manage BitLocker | Open Manage BitLocker, choose Turn on BitLocker next to Windows (C:), and follow the steps to back up the recovery key |

Windows encrypts in the background. Afterwards, boot Zorin once more to confirm that the start menu still offers both systems.

**Know what this does and does not protect.** It encrypts the Windows side. The Zorin partition, where the competition work will live, is not encrypted by this. For a desktop that stays in your home that is a reasonable trade-off, and it is the standard one for dual-boot machines. The decision is yours to make knowingly.

**From now on.** Any future firmware update, Secure Boot change or TPM reset can make Windows ask for the key once. That is expected. Keep step A.4.4's two copies for as long as you own the machine.

### A.13 When step A does not go as written

| Symptom | Most likely cause | What to do |
|---|---|---|
| The PC starts Windows and never offers the stick | The stick is not first in the boot order | Tap F11 at power-on and pick the stick by hand. Zorin: try another USB port, then another stick |
| The stick is not in the boot menu at all | Secure Boot is refusing it, or a USB setting is off | Zorin: most PCs accept it with Secure Boot on, but some refuse any non-Windows system. Enter the firmware and switch Secure Boot off. If it cannot be switched off, or a "GUID" key is requested, enable "Allow Microsoft 3rd Party UEFI CA" if present |
| Booting stops at an error about a signature or an "initramfs" prompt | A damaged stick or image | Write the stick again. If it persists, download the image again and check it as in step A.7.2 |
| Black screen after choosing the Zorin option | A graphics problem at start-up | Make sure you chose the entry with "(modern NVIDIA drivers)". Otherwise choose "Try or Install Zorin OS (safe graphics)" |
| The installer cannot see the internal drive | Windows was hibernated, not shut down | Zorin: start Windows, switch it fully off, and boot the stick again. Then check that Fast Boot is off |
| "No Bootable Device" after installing | A firmware setting about boot order | Zorin has a dedicated article for it, linked in section H.3. The PC has not lost anything |
| Zorin is installed but the PC always starts Windows | The firmware's boot order puts Windows first | Tap F11 and pick the Zorin entry for this start. For good, change the boot order in the firmware so that the Zorin entry comes first, or follow Zorin's article "Repair the Boot Loader" (section H.3) |
| An error during installation | One of the four causes above | Zorin's page "Error While Installing Zorin OS" covers them in order: check the image, connect to the internet, switch off Fast Startup and Fast Boot, then Secure Boot |
| A message at start-up about "fTPM" asking to press Y or N | The firmware noticed a change and offers to reset its TPM records | A Zorin forum member reports the message warns that pressing Y needs the recovery key. If Windows is encrypted, find the key first. Pressing N keeps the old records and continues |
| Windows asks for the recovery key | A change listed in step A.4.5 | Enter the key. Then, in Windows, confirm encryption is in the state you want |

---

---

## B. Linux for someone who knows Windows

You do not need to learn Linux. You need about twenty habits, and an idea of where things went. This section is that, and it is worth reading once before section C.

### B.1 Three ideas that explain most of what feels strange

**Everything is one folder tree, with no drive letters.** Windows starts at `C:\` and has other letters beside it. Linux starts at a single folder written as a single slash, `/`, and every disk is a folder somewhere inside it. Your USB stick becomes a folder. The Windows partition becomes a folder.

**You are not the administrator, most of the time.** Your account can do anything, but only when it asks. The word that asks is `sudo`, short for "superuser do". A program that goes wrong cannot take the system with it, because it was running as you.

**Software arrives from a signed app catalog, and updates itself in place.** The installer in section C uses the same catalog that Zorin's Software store uses. You will rarely download a program from a web page again, and when you do, it will be from the vendor's own instructions.

### B.2 Where things went

| In Windows | In Zorin | Note |
|---|---|---|
| Start button | Zorin Menu, at the left end of the panel | Or press Super (the key with the Windows logo) and type |
| Taskbar | The panel along the bottom | |
| Settings app | Settings | Same idea |
| File Explorer | Files | Press Ctrl and L to type a path |
| `C:\Users\<you>` | `/home/<you>`, shortened to `~` | Desktop, Documents and Downloads are inside it, with the same names |
| `C:\Program Files` | `/usr` | Never browse here to change anything |
| The registry | Small text files under `/etc` for the system and `~/.config` for you | A leading dot makes a file or folder hidden. Press Ctrl and H in Files to show them |
| `D:\`, a USB stick | `/media/<you>/<stick name>` | It also appears in the left sidebar of Files |
| The Windows partition | Other Locations in Files | Readable, as step A.11.6 showed |
| Command Prompt, PowerShell | Terminal | Zorin Menu, Utilities, Terminal |
| Task Manager | System Monitor | For the command line there is `top` |
| Event Viewer | `journalctl` | The system's diary, as text |
| Windows Update | Software Updater | Zorin Menu, System Tools |
| Microsoft Store | Software | Zorin Menu, Software. Zorin: it installs "from the Zorin OS & Ubuntu APT repositories, Flathub, and the Snap Store out of the box" |
| Notepad | Text Editor | Its command name is `gnome-text-editor` |
| 7-Zip, the built-in zip support | Archive Manager | Also creates encrypted archives |
| Microsoft Edge and its PDF reader | Brave, and Evince Document Viewer | Both pre-installed |
| Remote Desktop | Remmina | Pre-installed |
| Phone Link | Zorin Connect | Pre-installed |
| Outlook | Evolution | Pre-installed. Thunderbird is in Software |
| Microsoft Office | LibreOffice | Pre-installed. Microsoft 365 also works in a browser |
| Hyper-V | VirtualBox | In Software |

Zorin's own list of replacements for Windows apps is linked in section H.3.

### B.3 Twenty rookie mistakes, each with its fix

These are the ones that cost Windows users an evening on their first Linux machine. All of them are avoidable in a few seconds.

| Number | The mistake | What it looks like | Do this instead |
|---|---|---|---|
| 1 | Typing a password for `sudo` and deciding it did not work | Nothing appears as you type | That is normal. Type it, press Enter |
| 2 | Pressing Ctrl and C to copy in a Terminal | The program that was running stops | Ctrl and Shift with C to copy, and with V to paste |
| 3 | Closing the Terminal while a download or a run is going | The job dies with the window | Run long jobs inside `tmux` (section B.5) |
| 4 | Treating upper and lower case as the same | `No such file or directory` for a file you can see | `Tasks.jsonl` and `tasks.jsonl` are two different files. Use Tab to complete names |
| 5 | Pasting a Windows path | `No such file or directory` | Forward slashes, and no drive letter: `~/bcf/data/tasks.jsonl` |
| 6 | Typing `python` and getting "command not found" | The system ships only `python3` | Type `python3`, or work inside the project's environment where `python` exists (section F) |
| 7 | Installing Python packages into the system Python with `sudo pip` | Errors about an "externally managed environment", or a broken system tool | Install into the project's environment. Ubuntu's own tools depend on the system Python |
| 8 | Downloading a program from a web page, as in Windows | The wrong edition, or an installer that wants the whole disk | `sudo apt install <name>`, or the Software store, first |
| 9 | Piping a script from the web into a shell because a forum said so | Anything at all, later | Do it only for the one-line command printed in the vendor's own documentation. Section C's installer is an example: every line of it comes from a vendor page |
| 10 | A script copied from Windows that will not run | `$'\r': command not found` | Windows line endings. `sed -i 's/\r$//' <file>` fixes the file. The lift-and-shift package was already converted |
| 11 | Double-clicking a script, or running it from a USB stick | Nothing happens, or "Permission denied" | Run it with its interpreter: `bash <file>` or `python3 <file>`. A stick formatted for Windows cannot hold Linux permissions, so copy the folder to your home first |
| 12 | Deleting with `rm` as if it were the Recycle Bin | The file is gone for good | `rm` does not use the Trash. Delete in Files when unsure. Read any `rm` command twice before Enter |
| 13 | Running a graphical program with `sudo` | A file owned by root that you can no longer save over | To edit a system file with the editor, Zorin's own way is `gnome-text-editor admin:///etc/<file>` |
| 14 | Leaving Fast Startup on in Windows | The Windows partition opens read-only in Zorin, or not at all | It is already off from step A.5.2. Leave it off |
| 15 | Working with the big files on the Windows partition or a stick | Slow loads, and files that refuse to behave | Keep data, models and code in your home folder, which is on the Linux file system made for this |
| 16 | Using NVIDIA's `.run` installer, or mixing it with the package manager | A graphics driver that breaks at the next kernel update | Only the driver from Zorin's package manager (step A.11). After a kernel update, restart before GPU work |
| 17 | Restarting in the middle of a long run | Hours of GPU time lost | The Software Updater can wait until the run is finished |
| 18 | Putting spaces or unusual characters in folder names | Commands that break in ways that are hard to read | `~/bcf/data`, not `My Data (final)` |
| 19 | Running as root "to avoid password prompts" | One wrong command can damage the whole system | Stay your normal user. Use `sudo` per command |
| 20 | Editing a system file with no copy of the original | No way back | `sudo cp /etc/<file> /etc/<file>.bak` first. Section C's installer backs up automatically |

### B.4 The Terminal survival kit

Open a Terminal with Zorin Menu, Utilities, Terminal, or with Ctrl, Alt and T. These are the commands this guide uses, with what each one means.

| Command | Plain meaning | Windows habit it replaces |
|---|---|---|
| `pwd` | Which folder am I in | The address bar |
| `ls` | What is here | `dir` |
| `ls -la` | What is here, including hidden files, with sizes | `dir /a` |
| `cd ~/bcf` | Go to that folder | `cd` |
| `cd ~` | Go home | |
| `cd ..` | Go up one level | `cd ..` |
| `cat <file>` | Print a file | `type` |
| `less <file>` | Read a long file a page at a time. Press q to leave | Opening in an editor |
| `head -n 50 <file>`, `tail -n 50 <file>` | The first or last 50 lines | |
| `tail -f <file>` | Watch a growing file live, as in a log. Ctrl and C stops watching | Reading a log by hand |
| `grep -n "text" <file>` | Find lines that contain text, with line numbers | Find |
| `cp <from> <to>` | Copy | `copy` |
| `mv <from> <to>` | Move or rename | `move`, `ren` |
| `rm <file>` | Delete for good | `del`, with no Recycle Bin |
| `mkdir -p <path>` | Create a folder and any parents | `mkdir` |
| `df -h ~` | Free space on your disk | The drive's properties |
| `free -g` | Memory in use and free | Task Manager's memory page |
| `du -sh <folder>` | How big a folder is | Folder properties |
| `sudo apt update` | Refresh the catalog of available software | Checking the store |
| `sudo apt install <name>` | Install a program | A setup wizard |
| `apt search <word>` | Find programs by word | Searching the store |
| `sudo apt upgrade` | Install updates for everything | Windows Update |
| `which <command>` | Where a program lives on disk | `where` |
| `chmod +x <file>` | Mark a file as a program | Nothing. Windows uses the `.exe` ending instead |
| `sha256sum <file>` | The file's SHA-256 checksum | CertUtil |
| `history` | What you typed before | The up-arrow key does this too |
| `man <command>` | The manual for a command. Press q to leave | The `--help` option also works |

Four habits prevent most Terminal accidents:

1. **Read the whole command before Enter.** Especially ones that start with `sudo` or contain `rm`.
2. **Use Tab.** It completes names. If two files differ by one letter, Tab never picks the wrong one.
3. **Use the up-arrow** to bring back what you typed, then change the end.
4. **Ask for the plan first.** Anything that offers a dry run deserves one. Section C's installer does.

### B.5 tmux: the one tool to learn on day one

On Windows, closing a window does not always stop what was running. In a Linux Terminal it does. `tmux` keeps a session alive on the machine when the window is closed, and you can come back to it.

| You want to | Type |
|---|---|
| Start a session with a name | `tmux new -s work` |
| Leave it running and close the window | Press Ctrl and B, let go, then press D |
| See your sessions | `tmux ls` |
| Come back | `tmux attach -t work` |
| Leave it again | Ctrl and B, then D |

The model server and every long run in section F go inside a tmux session. A session does not survive a restart of the machine, so do not restart while a run is going.

The installer in section C installs tmux. If you want it before then: `sudo apt install tmux`.

### B.6 The four ways to install software, and when to use each

Zorin's help centre describes them all. They are listed here from safest to most careful.

| Way | What it is | When | Example from this guide |
|---|---|---|---|
| The Software store or `apt` | Programs from Zorin's and Ubuntu's catalogs, and from Flathub and the Snap Store | Always first | git, tmux, Docker |
| A `.deb` file | One program in a file, from its maker's web site. Double-click it and the Software store opens to install it | When the maker says so | Google Chrome, VS Code |
| The maker's own repository | The maker's catalog added to `apt`, so that updates arrive automatically | For tools that change weekly | VS Code, Claude Code, GitHub CLI, Docker. Section C's installer adds these for you |
| An `.AppImage` file | A portable program that runs from wherever it sits. Double-click it | For a single tool you want to try | None used here |

Ubuntu's documentation makes one point that saves real trouble: removing packages with the low-level tool `dpkg` is "NOT recommended in most cases", because it leaves behind whatever depended on them. Use `apt remove`, or the Software store.

**Windows programs.** A file ending in `.exe` or `.msi` will not run as it is. Zorin has an optional layer for that: double-click the file, or open Zorin Menu, System Tools, Windows App Support, and select Install. It suits older office programs and small utilities. It does not suit drivers, and nothing in this project needs it. You also still have Windows on the other boot.

---

---

## C. Running the lift-and-shift

The installer turns an hour of typing into about ten minutes of waiting. It was run to the end three times in a fresh Ubuntu 24.04 container before this guide was written; section H.4 says exactly what that did and did not prove.

### C.1 What you are carrying

| File | Size | Holds | Secret? |
|---|---|---|---|
| `zips/g914-lift-and-shift.zip` | 34.4 MB | 2,687 files: the installer, your Claude Code settings, rules, agents and skills, your VS Code settings, the research toolkit, your other workspace folders, 14 saved conversations, the auto-memory of 34 projects, ten competition packages, six harness wheels and the Kaggle documents | No. Every file was searched for your token and your Tavily key |
| `zips/g914-credentials.zip` | 6 KB | Your access token, your Tavily key, the stored Claude Code sign-in, and the original Windows settings for reference | **Yes. All of it** |
| `SHA256SUMS.txt` | under 1 KB | The SHA-256 of both zips | No |
| `kit/` | about 1 MB | The installer, the kickoff prompts and the manifest, unpacked so you can read them on Windows before you go | No |

The folder also holds this guide, in Markdown and as a single web page that needs no internet.

### C.2 Getting it onto the G914

Three routes. Pick one.

| Route | How | Good for | Watch out for |
|---|---|---|---|
| USB stick | Copy the two zips and `SHA256SUMS.txt` from the Windows PC to a stick. Plug it into the G914 and copy them into a folder in your Zorin home, not onto the desktop of the stick | Always works | Zorin reads FAT32, exFAT and NTFS sticks. Run the installer from your home folder, never from the stick |
| Your home network | On the old PC, in the `zips` folder: `python -m http.server 8733 --bind 192.168.1.10` with the old PC's own address. On Zorin: `wget http://192.168.1.10:8733/g914-lift-and-shift.zip` | No stick at hand | Stop the server afterwards with Ctrl and C. Use another port if 8733 is taken |
| A cloud drive | Upload the main zip, download it in Zorin | Only the main zip | **Never** the credentials zip |

**Rookie mistake.** Uploading the credentials zip to "yourself" through a chat app or a cloud drive. It holds a live token in plain text. A stick that stays in your pocket is the right tool.

### C.3 Unpack and check

Open a Terminal (Ctrl, Alt and T). The commands below put everything in a folder called `lift` inside your home folder. Type them one at a time.

```bash
mkdir -p ~/lift/zips
```

Copy the two zips into `~/lift/zips` and `SHA256SUMS.txt` into `~/lift` itself. In Files: press Ctrl and L, type `~/lift/zips`, press Enter, and drag the two zips in. Then Ctrl and L again, type `~/lift`, press Enter, and drag `SHA256SUMS.txt` in. Then:

```bash
cd ~/lift
sha256sum -c SHA256SUMS.txt
```

**Do this.** Expect two lines ending in `OK`:

```text
zips/g914-lift-and-shift.zip: OK
zips/g914-credentials.zip: OK
```

**If it goes wrong.** A line ending in `FAILED` means the copy was damaged on the way. Copy that file again. The two values, for reading by eye:

| File | SHA-256 |
|---|---|
| `g914-lift-and-shift.zip` | `2d5d78e8fe862e9302dbf0734eb6c558b2c023a8ddf8521b791efc4d7f9542ef` |
| `g914-credentials.zip` | `ac84d8603d29153c66cf9f4ec0f96194cc0692418330db113e501bc35ae118f3` |

Then unpack both next to each other:

```bash
unzip -q zips/g914-lift-and-shift.zip
unzip -q zips/g914-credentials.zip
```

You now have `~/lift/g914-lift-and-shift/` and `~/lift/g914-credentials/`. Read the first page of the package while you are here:

```bash
less ~/lift/g914-lift-and-shift/README-FIRST.md
```

Press q to leave.

### C.4 Look before you leap: the dry run

**Do this.** It prints every action the installer would take. It installs nothing, and writes nothing of its own. (The programs it asks for their versions keep their own logs. VS Code's command-line tool writes a small log file each time it starts, which is why a re-run may add a few of those.)

```bash
cd ~/lift/g914-lift-and-shift
bash install.sh --dry-run --credentials ../g914-credentials --with-docker
```

Read what it prints. In order: a banner with the three folders it will use, six checks of the machine, eleven short stage plans, and a summary table in which every stage reads PASS.

| Check | Healthy result | If not |
|---|---|---|
| Operating system | Zorin OS 18, or Ubuntu 24.04 | Another system: the steps target Zorin 18, so read the rest with care |
| Processor | x86_64 | |
| Graphics | On a fresh install it says no NVIDIA driver is active yet | Expected here. Section A, step 8 comes first if you skipped it |
| Free space | At least 80 GB | Make more room, or use the Zorin partition for `~/bcf` |
| Internet | Reachable | Join Wi-Fi or plug in the cable |
| Secrets | "folder found" | "folder NOT found": check the path in the command |

**Rookie mistake.** Running it with `sh install.sh`. The script is written for bash, which is Zorin's default shell, and `sh` is a smaller one that would stop at the first modern line.

### C.5 Run it

```bash
bash install.sh --credentials ../g914-credentials --with-docker
```

It asks for your password once, when the first package stage starts. Nothing appears as you type. Then it works through eleven stages. Five to ten minutes, most of it downloads. In the Linux test for this guide the first run took four to five minutes on a fast connection, and Docker adds about a minute.

**Do this.** When it says you were added to the docker group, log out and log back in once. Until you do, Docker asks for `sudo`. Do it now, so that section F never has to think about it.

Each line on the screen is also written to `~/g914-install.log`. The markers mean:

| Marker | Meaning | What you do |
|---|---|---|
| green `OK` | Done, and checked | Nothing |
| dim text | A detail: what was copied, what a step would do | Nothing |
| yellow `..` | Worth knowing, not a failure. On this machine: no NVIDIA driver yet, and optional tools the research toolkit can live without | Read it once |
| red `XX` | A stage failed | The summary names it. See section C.7 |

### C.6 What each stage does

| Stage | Installs or restores | How you know it worked |
|---|---|---|
| 1 | Base tools from Zorin's own catalog: git, curl, wget, tmux, jq, pandoc, build tools, unzip helpers, shellcheck | A line with the git, curl and pandoc versions |
| 2 | Google Chrome, which the research toolkit drives | "Google Chrome 158" or newer |
| 3 | Visual Studio Code from Microsoft's own catalog, the Claude Code extension and the Python extension with its two companions, and your VS Code settings | "VS Code: 1.148" or newer, and the extension lines |
| 4 | Claude Code from Anthropic's own catalog, after checking its signing key against the published fingerprint. Then your settings, rules, 49 agents and 103 skills | "signing key fingerprint matches" and "Claude Code: 2.1" or newer |
| 5 | uv, the exact Python the harness needs (3.12.13), and Node.js LTS for the research toolkit | "Python 3.12.13" and a Node version of 22 or newer |
| 6 | GitHub CLI | "gh version 2.105" or newer |
| 7 | Your workspace: the research toolkit, tool records, prompts, skills and saved conversations. Your Tavily key goes into the toolkit's config, and the toolkit's own health check runs | "research toolkit: doctor passes" |
| 8 | Claude Code's auto-memory, project by project | "34 memory folder(s) restored" |
| 9 | Ten competition packages, the six harness wheels, and the Kaggle documents. It also creates the empty `data`, `models`, `results` and `submit` folders | "10 package(s)" |
| 10 | Docker Engine, from Docker's catalog for Ubuntu 24.04. The sandbox images of section F need it | "Docker version 29" or newer, and the note about the docker group |
| 11 | Nothing. It runs each installed program once and prints what answers | A list of versions |

Two switches add to the last two stages:

| Switch | Adds | When |
|---|---|---|
| `--with-docker` | Stage 10: Docker Engine | The commands above already include it. Zorin reports itself as version 18, for which Docker publishes nothing, so the script points at Ubuntu's "noble" catalog on purpose |
| `--with-browser-mcps` | Two of your MCP servers (section D, step 6) | Optional. If you want Claude Code to inspect web pages in a real browser, as it did on Windows |

Either can be added later: `bash install.sh --only 10 --with-docker`, or `bash install.sh --only 5 --with-browser-mcps`.

### C.7 If a stage fails

The summary at the end names the stage in red and the script exits with an error code. Nothing else is harmed: every stage is independent, and a re-run skips what is already done.

1. Find the reason. The installer's own lines are the ones that start with a time:

   ```bash
   grep -n -E "FAIL|error|Error" ~/g914-install.log | tail -20
   ```

2. Fix the cause. In practice it is one of these:

| The log says | Cause | Fix |
|---|---|---|
| "Could not resolve", "Temporary failure", "Connection refused" | The network dropped | Check Wi-Fi or the cable, then re-run |
| "is not in the sudoers file" | Your account cannot administer the PC | Use the administrator account you created in step A.10 |
| "does not have a Release file" | A catalog address changed since this guide was written | Re-run with the internet up. If it persists, open the stage in `install.sh` and compare its address with the vendor's documentation (section H.3) |
| "No space left on device" | The Zorin partition is full | Free space. 80 GB is the floor for this project |

3. Re-run only that stage, by number:

   ```bash
   bash install.sh --only 4 --credentials ../g914-credentials
   ```

4. Finish with the check stage:

   ```bash
   bash install.sh --only 11
   ```

**If it goes wrong.** The script stops at its first check and says "You are root". Log in as your normal user. Or it says the package is incomplete: the zip did not unpack fully. Delete `~/lift/g914-lift-and-shift` and repeat section C.3.

### C.8 Where everything landed

| Folder | What is in it |
|---|---|
| `~/.claude/settings.json` | Your Claude Code settings, with the access token filled in. Readable by you only |
| `~/.claude/rules`, `~/.claude/agents`, `~/.claude/skills` | Your rule, your 49 agents, your 103 skills |
| `~/.claude/projects/<project>/memory` | The auto-memory of 34 projects |
| `~/.config/Code/User/settings.json` | Your VS Code settings |
| `~/46-wide_research_test` | Your workspace: `research-toolkit`, `toolrecs`, `sysprompts`, `webfetch`, `agent_skills`, `kagglecompmemory`, your saved conversations and more |
| `~/bcf/packages` | The ten competition packages, the test sets playbook among them |
| `~/bcf/wheels-harness` | The six harness wheels, for the validator environment |
| `~/bcf/docs` | The harness README and the saved Kaggle pages |
| `~/bcf/data`, `~/bcf/models`, `~/bcf/results`, `~/bcf/submit` | Empty. Section F fills them |
| `~/g914-install.log` | Everything the installer did |
| `~/g914-backup-<date and time>` | Copies of any file the installer replaced. On a new machine this is usually one VS Code settings file |

**Three things to know about what was restored.**

- **Plugins install themselves on first start.** FlightDeck, superpowers and the others come from GitHub when Claude Code first opens, not from this zip. It needs the internet for that first minute.
- **Memory for your other projects is stored under its Windows names.** The memory of this research workspace is the exception: it was renamed to match the workspace's new Linux path, so it loads. A memory for a project at `D:\code\foo` is kept under a name derived from that Windows path. It loads again only if that project is opened from a path with the same name, which on Linux it will not be. To reuse one, copy its files from `~/.claude/projects/` into the `memory` folder of the project where you want it.
- **Open a new Terminal before using uv.** Its installer added a line to your shell's start-up files. A Terminal that was already open does not have it yet.

### C.9 Put the secrets away

The credentials folder has done its job. Delete it from the G914 and, when you are back on Windows, from the stick too:

```bash
rm -rf ~/lift/g914-credentials ~/lift/zips/g914-credentials.zip
```

**Read that line twice before Enter.** It names two paths, both inside `~/lift`. Keep `~/lift/zips/g914-lift-and-shift.zip`: it is your backup copy of the package and it holds no secret.

Your token now lives in one place on this machine, `~/.claude/settings.json`, with permissions for you alone. Your Tavily key lives in the research toolkit's config. Both are exactly where they were on Windows, under different addresses.

---

---

## D. Visual Studio Code, the Claude Code extension, and your keys

The installer of section C already installed all of it. This section is for checking that it works, for the two keys it could not know, and for the sign-ins only you can do.

### D.1 Step 1: open your workspace in VS Code

Open a Terminal and type:

```bash
code ~/46-wide_research_test
```

VS Code opens with the folder loaded. The first time, it asks two things.

| It asks | Answer | Why |
|---|---|---|
| "Do you trust the authors of the files in this folder?" | Yes, I trust the authors | These are your own files, carried from your Windows machine |
| To sign in to sync settings | Skip | Your settings came from the zip |

**Why start it from a Terminal.** A VS Code started this way inherits the Terminal's environment, including the small change the installer made for uv. Starting it from the Zorin Menu works too, after a log-out and log-in.

**Tip.** Choose File, then Add Folder to Workspace, and add `~/bcf`. Everything you need for the next week is then in one window.

### D.2 Step 2: the Claude Code extension

It was installed by stage 3. Look for the Claude Code icon in the left bar of VS Code and select it.

If the icon is missing, install it by hand. Claude Code's own instructions for VS Code: "press Cmd+Shift+X (Mac) or Ctrl+Shift+X (Windows/Linux) to open the Extensions view, search for 'Claude Code', and click Install."

To check in a Terminal:

```bash
code --list-extensions | grep -i -E "claude|python"
```

Expected: four lines, `anthropic.claude-code`, `ms-python.debugpy`, `ms-python.python` and `ms-python.vscode-pylance`.

Two pieces of Claude Code now exist on the machine, and both are wanted. The extension has a copy for its chat panel. Stage 4 also installed the command-line program, which is what lets you type `claude` in any Terminal and what section E's agent uses to register things. Claude Code's documentation puts it this way: the extension "bundles the CLI for its chat panel, but typing `claude` in a terminal requires the standalone CLI install".

### D.3 Step 3: how your Claude Code signs in

Your Claude Code on Windows did not sign in to Anthropic. It sent its requests to a model gateway, at an address stored with a token. Both were in your Claude Code settings, and both were carried over. They sit in `~/.claude/settings.json` under `env`, as `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`.

So there is no sign-in to do. Claude Code's settings file is "shared between the extension and CLI", so the panel and the Terminal program use the same gateway.

**If it goes wrong.** The panel shows a sign-in screen anyway, or "Not logged in". In this order:

| Try | Why |
|---|---|
| Do step D.4. The token is still a placeholder | The installer had no credentials folder, or could not read it |
| Close VS Code and open it again from a Terminal, as in step D.1 | Claude Code's documentation: if settings from the shell are ignored, "Launch VS Code from a terminal with `code .` so it inherits your environment variables" |
| Command Palette (Ctrl and Shift with P), then "Developer: Reload Window" | The same documentation's fix for a panel that did not pick up a change |

### D.4 Step 4: the access token

You can skip this if you ran the installer with `--credentials` and the summary did not mention a placeholder.

Find the placeholder:

```bash
grep -c "__ANTHROPIC_AUTH_TOKEN__" ~/.claude/settings.json
```

A `0` means the token is in place. A `1` means you need to paste it. On the old Windows machine it is in `C:\Users\<you>\.claude\settings.json`, under `env`, as the value of `ANTHROPIC_AUTH_TOKEN`. Then either re-run stage 4 with the credentials folder next to the package:

```bash
cd ~/lift/g914-lift-and-shift
bash install.sh --only 4 --credentials ../g914-credentials
```

or edit the file in VS Code and replace the placeholder between the quotes:

```bash
code ~/.claude/settings.json
```

**Rookie mistake.** Pasting a token into a chat window, a screenshot or a command line. A command typed at a prompt is kept in the shell's history. Edit the file instead.

**Prove it.** Open a Terminal in `~/46-wide_research_test`, type `claude`, press Enter, and send it one word: hello. An answer means the gateway accepts the token. Type `/exit` to leave.

### D.5 Step 5: the Tavily key

The same check for the key your research toolkit searches with:

```bash
grep -c "__TAVILY_KEY__" ~/46-wide_research_test/research-toolkit/.research-config.json
```

A `1` means paste it. On Windows it is in `research-toolkit\.research-config.json` under `engines`, `tavily`, `keys`: the value called `key`. Re-run stage 7 with the credentials folder, or edit the file in VS Code.

Then run the toolkit's health check:

```bash
bash ~/46-wide_research_test/research-toolkit/bin/doctor.sh
```

The last line should read "All hard requirements met". Several yellow warnings about optional tools are normal: they name things this project does not need.

### D.6 Step 6: your MCP servers (optional)

MCP servers are extra tools Claude Code can call. You had thirteen on Windows. Each one started a Windows program, so none of them works on Linux as it was. Here is where each stands.

| MCP server | On the G914 | Note |
|---|---|---|
| `chrome-devtools-mcp` | Ready, if you ask for it | Drives Chrome. This is the one that inspected web pages in a real browser |
| `playwright-mcp` | Ready, if you ask for it | The same, through Playwright |
| `agent-browser` | Not carried | A Node package that would install on Linux too. Add it if you used it |
| `greptile`, `mintlify` | Come back with their plugins | They belong to plugins, which install on first start |
| `rea` | Not carried | Needs Ghidra and a Java kit, which stayed on Windows |
| `adb`, `frida`, `mobile-mcp` | Not carried | Android and security tools tied to the Windows machine |
| `android-mcp`, `android-mcp-17` | Not carried | They are containers on the Windows machine |
| `browsentic`, `obscura`, `artemis` | Not carried | Windows programs |

The competition workflow does not need any of them. If you want the two browser ones back:

```bash
cd ~/lift/g914-lift-and-shift
bash install.sh --only 5 --with-browser-mcps
```

It installs the same two versions you ran on Windows and registers them where they were, at user scope. Claude Code's own check then shows them:

```bash
claude mcp list
```

**Do this.** Expect a line for each ending in "Connected". In the Linux test for this guide both connected, and each answered a first request with its list of tools.

**Rookie mistake.** Adding an MCP server that launches with `cmd /c` or a `.exe` path copied from Windows. It cannot start. Register the Linux program instead, with `claude mcp add --scope user <name> -- <command>`.

### D.7 Step 7: the sign-ins only you can do

| What | Why | How |
|---|---|---|
| Git identity | Every commit records a name and an e-mail. The Windows values came with the package | `cp ~/g914-lift-and-shift/home/gitconfig.template ~/.gitconfig`, then open the file once and confirm the two lines |
| GitHub | To reach your repositories and to push | `gh auth login`, then follow the prompts. GitHub CLI asks to open a browser and give it a one-time code |
| Kaggle | To download the 22 GB data package and to submit | On kaggle.com, open Settings, find API, and choose Create New Token. Save the file it offers as `~/.kaggle/kaggle.json`. Then `chmod 600 ~/.kaggle/kaggle.json`. The rules of the competition must be accepted on its page first |
| Hugging Face | Nothing to do | The model's repository is public and not gated. The Hugging Face API said so on 2026-11-25, when this guide was checked. No account, no licence and no token are needed to download the main model |

**If it goes wrong.** You never pushed from this machine before and GitHub refuses: `gh auth status` says whether you are signed in. Run `gh auth setup-git` and GitHub CLI configures git to use that sign-in.

**About SSH.** Your private key stayed on Windows, on purpose. Use GitHub CLI and addresses that start with `https://`, or generate a new key on the G914 and add its public half to GitHub.

### D.8 Step 8: the first session, a five-minute check

Everything before this was preparation. This is the first real use, and it tells you in five minutes whether the lift worked.

1. In VS Code, select the Claude Code icon, then start a new conversation.
2. Paste this one line and send it:

   ```text
   Before anything else, do not run any command. Answer from memory only, in a short table with three rows: (1) what my standing rules are for web research and where files are kept, (2) which competition I am working on and what "BCF brain" means in it, (3) what my preference is about background agents. Then list the names of my skills that start with "rdw-".
   ```

3. Read the answer against this table:

| It should show | Comes from | If missing |
|---|---|---|
| Research through the research toolkit, official documentation cited, deliverables and scratch folders | Your memory for this workspace | Stage 8. Check `ls ~/.claude/projects/-home-<you>-46-wide-research-test/memory` |
| The Gemma 4 Developer Agent competition, and the brain as your agent scaffold | Same | Same |
| Work on the main thread, ask before using background agents | Same | Same |
| A list of `rdw-` skills, among them `rdw-deep-wide-research` | Your 103 skills, stage 4 | `ls ~/.claude/skills` |
| The FlightDeck panel, if you had it open | The FlightDeck plugin, fetched from GitHub on first start | Section D.9 |

**Tip.** Save this check as a note for later. After any change to Claude Code, five minutes with this one question shows whether your setup is still in place.

### D.9 When VS Code or Claude Code misbehaves

| Symptom | Cause | Fix |
|---|---|---|
| `claude: command not found` in a Terminal | The Terminal was open before the install, or the standalone program did not install | Open a new Terminal. Then `grep -n "FAIL" ~/g914-install.log` and re-run stage 4 if needed |
| `code: command not found` | Same for VS Code | Open a new Terminal. Re-run stage 3 if needed |
| "Plugins" do not appear, or FlightDeck is missing | The first start could not reach GitHub | Check the internet, then in Claude Code run `/plugin` and look at the list |
| A hook reports `node: command not found` | The hook that logs Tavily usage needs Node | Open a new Terminal, or re-run stage 5 |
| An MCP server shows "Failed to connect" in `claude mcp list` | Its program is missing | Re-run `--only 5 --with-browser-mcps`, or remove it: `claude mcp remove <name>` |
| The agent does not remember your rules | The workspace was opened from another path | Open `~/46-wide_research_test` itself, not a copy or a parent folder |
| A permission prompt appears for every command | Expected on a new machine: your allow-list had Windows paths in it, which were dropped because they mean nothing here | Approve as you go. Your agent can add the Linux equivalents to `permissions.allow` |

---

---

## E. Kickoff: handing the rest to Claude Code

From here on you direct and approve. An agent does the typing.

### E.1 What an agent knows when it starts

A new session begins empty. It has none of this guide in mind and no memory of any conversation. Everything it learns comes from five places, and the lift-and-shift filled all five.

| Where | What it gives the agent | Filled by |
|---|---|---|
| `~/.claude/settings.json` | Which model gateway to use, which actions are pre-approved, which hooks run | Stage 4 |
| `~/.claude/rules` | Your standing rule about testing on devices | Stage 4 |
| `~/.claude/skills` | 103 skills it can invoke, including the deep-and-wide research workflow | Stage 4 |
| Your memory for the workspace | How you work: research rules, folder conventions, what was finished and what is pending | Stage 8 |
| The kickoff prompt, and the documents it names | Where it is, what is done, what you want next | This section |

**Why the kickoff prompt matters.** The first message is the only part you write. A good one names the machine, the goal, what is already finished, the documents to read and how you want to be treated. A vague one sends the agent looking for information that is already on disk.

### E.2 Nine habits for directing an agent on a new machine

| Habit | In practice |
|---|---|
| One phase at a time | Each phase below ends with a status table. Read it. Then say "go on", or correct something first |
| Ask for evidence | "Show me the real output" after every step. A line that says done is not proof. A version number is |
| Keep it on the main thread | You can watch every command. The kickoff prompt asks the agent to do so |
| Long jobs in tmux | Downloads, the model server and runs survive a closed window that way |
| Stop means stop | Say "stop" whenever you want. The agent keeps its notes on disk and resumes from them |
| Confirm before damage | The agent must ask before it deletes, overwrites or pushes. Answer only after reading what it named |
| Secrets by file, never by chat | The agent reads keys from files and passes them on. It never echoes them |
| Steps only you can do | Typing your password, signing in to GitHub, creating a Kaggle token, solving a CAPTCHA. The agent stops and tells you which |
| Short sessions | Start a fresh conversation for each phase. A long conversation forgets its beginning; the status file does not |

### E.3 The kickoff prompt

The same text is in the package as `SYSTEM_PROMPT_KICKOFF.md`. With `~/46-wide_research_test` open in VS Code, select the Claude Code icon, start a new conversation, paste the block under "The kickoff prompt", and send it.

```text
You are my senior pair engineer on a new machine. Read this whole message before you act, then work through the phases in order, one at a time.

WHERE WE ARE
- Machine: PowerSpec G914 desktop (AMD Ryzen 9 9950X3D, NVIDIA GeForce RTX 5090 with 32 GB, 64 GB RAM, 2 TB NVMe). Operating system: Zorin OS 18 (Ubuntu 24.04 underneath), installed alongside Windows 11. I am a lifelong Windows user and this is my first week on Linux: explain Linux habits as you use them, in one sentence each, and flag anything that would surprise a Windows user.
- Purpose: the Kaggle "Gemma 4 Developer Agent" competition. Final submissions close 2026-12-02 23:59 UTC. I need this machine to run the competition's test harness locally, serve the competition model, run my agent scaffold (the "BCF brain") against the official naive baseline, measure results, improve the brain, and submit.
- Already done by the install script: base packages, Google Chrome, VS Code with the Claude Code extension, Claude Code with my settings, rules, agents and skills, uv, Python 3.12.13, Node.js LTS, GitHub CLI, my workspace at ~/46-wide_research_test (it holds research-toolkit/, toolrecs/, sysprompts/, webfetch/, agent_skills/ and my past conversations), my auto-memory for this and other projects, and the competition packages under ~/bcf/packages. The log is ~/g914-install.log.
- The documents you need are in the package and were written for exactly this machine:
  - ~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook/01_Playbook_Install_Zorin_OS_18.md (the TWO Python environments, both data sets, the sandbox image, the acceptance checks: its steps 5 to 13; its steps 1 to 3 are already done)
  - ~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook/02_Playbook_First_Run_and_Gates.md (the gate on a test set, the model server, the first tasks)
  - ~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook/ (the other playbooks, and tools/: run_set.py, compare.py, ledger.py, gates.py, finish_env.py, check_setup.py)
  - ~/bcf/packages/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/07_Setup_and_Run_Guide.md (the model server, the smoke panel, the public panel runs, the loop, the submission; its Track B is Zorin)
  - ~/bcf/packages/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/04_Local_Scoring_and_Interpretation_Guide.md (how to read local scores)
  - ~/bcf/packages/2026-11-25_BCF_Naive_vs_Brain_Hypothetical_vs_Actual/04_Live_Run_Playbook.md (the naive-versus-BCF live run)
  - ~/bcf/packages/2026-11-23_BCF_Brain_and_Dataset_RCA/03_Validation_Results_and_Submission_Playbook.md (validation and submission rules)
  - ~/bcf/packages/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/06_Impact_Effort_Roadmap.md (the improvement roadmap)
  Read the relevant one before each phase and follow it; each records which steps were verified and which were not.
- Two facts that override those documents where they say otherwise:
  1. There are TWO Python environments, on purpose. The model server lives in ~/bcf/.venv. The harness lives in ~/bcf/.venv-harness. Wherever the 2026-11-24 setup guide or the live-run playbook says `source ~/bcf/.venv/bin/activate` before a harness command (the panel runner, the validator, the live-run kit), activate ~/bcf/.venv-harness instead. Never install the harness packages into ~/bcf/.venv, and never install the serving stack into ~/bcf/.venv-harness.
  2. The model repository google/gemma-4-31B-it-qat-w4a16-ct is public and not gated. No Hugging Face account or token is needed.

WHAT IS NOT DONE YET (these are your phases)
Phase 0  Orientation and plan. Confirm what the install script finished by reading ~/g914-install.log and running cheap checks. Write ~/bcf/SETUP-STATUS.md with a table of phases and their state.
Phase 1  Loose ends from the lift: my access token for Claude Code and my Tavily key, if still placeholders; the NVIDIA driver (nvidia-smi must show the 5090 with driver 580 or newer); GitHub sign-in.
Phase 2  The two environments: ~/bcf/.venv for the model server and ~/bcf/.venv-harness for the harness, both on Python 3.12.13, from the competition wheelhouse (Playbook 1, steps 5, 7, 8 and 12).
Phase 3  Downloads: the competition data package (21.9 GB), the FreshSWE-Py data set (about 7 GB) and the model (17 to 18 GB). I must create a Kaggle API token myself; tell me exactly where to click and where to put the file.
Phase 4  Build and validate the BCF brain, and check the playbook: assemble, build, unit tests, the official compiler (guide 07, section 8), then the playbook's self-test and acceptance checks.
Phase 5  Sandbox images, the gate on the first test set, the model server, and the first runs: one task, three tasks, the five-task smoke panel.
Phase 6  The live run: both versions of the brain and the official naive baseline on task httpx_3672, three repeats each, through the live-run kit, then read what the model actually decided.
Phase 7  Analysis of the live captures against the scripted reference: the checkpoints, the decision at the first red test, the calls that differ.
Phase 8  The test sets and the improvement loop: slices, paired comparisons, rotation (Playbooks 3 to 6, guide 07 section 7, the roadmap).
Phase 9  Submission: the notebook that produces submission.zip (guide 07, sections 9 to 11).

HOW I WANT YOU TO WORK
- One phase at a time, in small steps. Stop at the end of each phase, show me a short status table (phase, state, evidence, what you need from me), and wait for my go-ahead. If I say "stop", stop.
- Verify, do not assume. After every step run the check that proves it and show the real output. If a step was not verified, say so in the status table. Never report a download, an install or a test as finished without its evidence.
- Long jobs (downloads over a gigabyte, the model server, runs) go inside tmux with a log file. Tell me the session name and the log path, and poll the log rather than blocking. Never start two servers on the same port.
- Some steps only I can do: type the sudo password, create the Kaggle token, sign in to GitHub, solve a CAPTCHA in a browser, accept competition rules. When you reach one, tell me exactly what to do and wait.
- Secrets: never print, paste into a command, log or upload a token, key or password. Read keys from files and pass them through environment variables. Nothing on this machine gets uploaded anywhere except Kaggle submissions I approve one by one.
- Before any command that deletes or overwrites files outside a scratch folder, or any git push, tell me and wait.
- Web research goes through my research toolkit (~/46-wide_research_test/research-toolkit, see its README.md), with `bash research-toolkit/bin/ensure-browser.sh <research-folder>` first. Trust official documentation over recollection, and cite the page for every external fact.
- Agents: work on the main thread by default so I can watch in FlightDeck. If a phase would clearly go faster with parallel agents, say so and ask once.
- Keep ~/bcf/SETUP-STATUS.md current: every time a phase changes state, update that file.
- You have my project memory for this work (MEMORY.md). Treat it as my standing instructions, including the research workflow rules, and add a memory entry when you learn something durable about this machine.

Start now with Phase 0 only.
```

### E.4 The phase prompts

Paste each one when the previous phase's status table says it is done. They are the same text as in the package's `SYSTEM_PROMPT_KICKOFF.md`.

#### Phase 0: orientation

```text
Phase 0. Read ~/g914-install.log and list every stage with its result. Then check, with real commands: nvidia-smi, df -h ~, free -g, code --version, claude --version, node -v, uv --version, python3 --version, gh --version, and that ~/46-wide_research_test/research-toolkit and ~/bcf/packages exist. Write ~/bcf/SETUP-STATUS.md with one row per phase (0 to 9), columns: state, evidence, what you need from me. Do not install anything in this phase.
```

#### Phase 1: loose ends

```text
Phase 1. Loose ends. (a) Check whether ~/.claude/settings.json still contains the placeholder __ANTHROPIC_AUTH_TOKEN__ and whether research-toolkit/.research-config.json still contains __TAVILY_KEY__. If so, tell me the two places on my old Windows machine where I can copy each value, then wait; when I have put them in ~/bcf/secrets/ as plain text files, fill the placeholders without echoing either value and delete the two files afterwards. (b) NVIDIA: if nvidia-smi does not show the RTX 5090 with driver 580 or newer, walk me through Zorin's own steps (Software Updater, Settings, Additional Drivers, the newest NVIDIA driver, then a restart) and verify afterwards. If you must pick a variant by hand, this card is a Blackwell part and needs the one whose name ends in -open. (c) Run `gh auth status`; if not signed in, start `gh auth login` for me and wait.
```

#### Phase 2: the two environments

```text
Phase 2. Follow 01_Playbook_Install_Zorin_OS_18.md (in ~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook) steps 5, 7, 8 and 12, in that order, and read the guide's section F.2 first. Step 5: the competition wheelhouse (41 wheels) into ~/bcf/wheelhouse. Step 7: ~/bcf/.venv on Python 3.12.13 for the model server: PyTorch 2.10.0+cu128, torchaudio and torchvision from the cu128 index first, then vllm 0.19.1, then the wheelhouse through the install-wheelhouse.sh script of the 2026-11-24 package; prove it with the line that prints torch, the CUDA capability and the vllm version. Step 8: ~/bcf/.venv-harness with the four harness wheels installed with --no-deps. Step 12: in ~/bcf/.venv-harness and from the playbook folder, run tools/finish_env.py --dry-run and then tools/finish_env.py until it prints that every probed module imports. Run the long installs inside tmux with a log. Report the three results: the server line (expect 2.10.0+cu128, capability (12, 0), vllm 0.19.1), the four harness packages with their versions, and the last line of finish_env.py.
```

#### Phase 3: data and model

```text
Phase 3. Three downloads, each in tmux with a log; check free space first and tell me the three sizes. (a) The competition data package (21.9 GB): guide 07 section B.5, into ~/bcf/data. Confirm that tasks.jsonl, snapshots, graphs, embeddings, wheels, docker, sandbox and sample_submission are present and that tasks.jsonl has 129 lines. (b) The FreshSWE-Py data set (about 7 GB): Playbook 1 step 6, into ~/bcf/data/freshswe-py. (c) The model google/gemma-4-31B-it-qat-w4a16-ct from Hugging Face into ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct; the repository is public, so no token is needed. Tell me how to create a Kaggle API token and where to save it (I will do it) before (a) and (b).
```

#### Phase 4: build and validate the brain, and check the playbook

```text
Phase 4. Guide 07 sections B.7 and 8, and Playbook 1 steps 4, 11 and 13. Copy the patched brain (2026-11-24 package, bcf-brain-patched) to ~/bcf/brain and keep the 2026-11-23 brain at ~/bcf/brain-v1123. Copy the 2026-11-24 package's tools folder to ~/bcf/tools and the whole 2026-11-25_BCF_Test_Sets_Playbook package to ~/bcf/playbook. In each brain: python build.py, python -m unittest tests.test_bcf, python tools/setup_validate_venv.py (once), python tools/run_validator.py; use the harness environment ~/bcf/.venv-harness whenever a step needs the harness. Then, in ~/bcf/playbook with that environment active: python3 tools/selftest.py and python3 tools/check_setup.py, and show me both tables. Show the real summary line of each command. Do not change any file under either brain or under the playbook without asking me first.
```

#### Phase 5: sandbox images, the gate, the model server, the first runs

```text
Phase 5. (a) Sandbox images. Docker's repository was already added by the installer, so do not add it again. If `docker` is not found, Docker Engine has not been installed yet: run `bash ~/lift/g914-lift-and-shift/install.sh --only 10 --with-docker`, then have me log out and in before you continue. Build swebench-sandbox:latest as in guide 07 step B.6, and freshswe-sandbox:latest as in Playbook 1 step 10. (b) The gate, which needs no model: Playbook 2 step 2, `python3 tools/gates.py --selfcheck` then `--set P20 --part full`, in the harness environment from ~/bcf/playbook. Show me its last two lines. (c) Start vLLM inside tmux (session name vllm-31b, log ~/bcf/vllm-31b.log) with the serve command of Playbook 2 step 3, adding --enable-lora --max-loras 8 --max-lora-rank 128 because the naive baseline ships LoRA adapters. Wait for the line that says the server started, then prove it with curl http://127.0.0.1:8000/v1/models and one small completion. (d) Run tools/check_setup.py again, then Playbook 2 steps 5 and 6 (one task, then three), then the five-task smoke panel of guide 07 section 6 with the harness environment. Report every summary.json number and anything strange in the logs.
```

#### Phase 6: the live run

```text
Phase 6. Follow ~/bcf/packages/2026-11-25_BCF_Naive_vs_Brain_Hypothetical_vs_Actual/live-run-kit/PLAYBOOK.md: copy the kit to ~/bcf/live-run-kit, write settings.json, activate the harness environment ~/bcf/.venv-harness, run scripts/preflight.py and show me its table, then run scripts/run_live.py on task httpx_3672 for bundles v1123, v1124 and naive with three repeats. Run it inside tmux with a log. When it finishes, show me SUMMARY.md and, for one run of each bundle, the checkpoints table from decisions.md.
```

#### Phase 7: analysis

```text
Phase 7. For every capture of the live run, read decisions.md and live_vs_scripted.md and answer, with the call numbers as evidence: Did the installer run? Was the spec relayed word for word? At which call and second was the first source edit? What did the model do at the first red test: keep the rename, alias the old name, or revert? How many edits did the helper refuse? Did it call finalize before submit_patch? Then compare the three bundles and the three repeats in one table, and tell me the single most important thing to change in the brain, with your reasoning and your confidence.
```

#### Phase 8: the test sets and the improvement loop

```text
Phase 8. Read Playbooks 3 to 6 (in ~/bcf/playbook), guide 07 sections 7 and 8, and the roadmap in 06_Impact_Effort_Roadmap.md. Propose the next experiment as one change with an adopt condition written down before the run, wait for my approval, then run it on a slice of P20 with `python3 tools/run_set.py` in the harness environment, one task at a time whenever timing matters, and read it with `python3 tools/compare.py`. Use a new set for each new comparison, and B40 to confirm an adopted change before it is submitted. For the public tasks, the guide's 30-task panel three times per bundle is the equivalent. Present the paired table and say whether the adopt condition was met.
```

#### Phase 9: submission

```text
Phase 9. Guide 07 sections 9 to 11 and 03_Validation_Results_and_Submission_Playbook.md in the 2026-11-23 package. Build the bundle I name, validate it again with the official compiler, list the checks that protect against a silent 0.00, and draft the submission notebook. Show me the notebook source and the bundle's SHA-256 before anything is submitted, and wait for my approval at every submit.
```


### E.5 Directing several agents at once

Your standing preference is to keep work on the main thread and to be asked before agents run in parallel. The kickoff prompt carries that. For the days when you do want to go wider, these are the rules that keep it safe.

| Situation | Main thread | Parallel agents, after you agree |
|---|---|---|
| Installing, configuring, anything with `sudo` | Always | Never |
| Anything that touches the GPU or the model server | Always, one server at a time | Never |
| Reading several long documents to answer one question | Slower | Good. Ask for findings with file and section, not for file dumps |
| Research on the web | Good | Good, one research folder per agent, so each has its own browser profile |
| Reviewing a change to the brain's code | Good | Good: a fresh reader sees more than the author |
| Writing documentation in several files | Fine | Good, when the files do not depend on each other |

**Rookie mistake.** Unleashing six agents on phase 2. They would each install into the same environment and race for the same folder. Installation is strictly one-at-a-time.

**Tip.** FlightDeck shows your agents as they work. It came back as a plugin. If the panel does not open, run `/plugin` in Claude Code and check that it is enabled.

### E.6 After every phase

The agent ends each phase with a short table: phase, state, evidence, what it needs from you. Check three things before you say "go on".

1. **The state is "done" only with evidence next to it.** A version number, a file listing, a line from a log.
2. **Anything not verified says so.** A row that reads "not verified" is honest and useful. A row that reads "done" without evidence is neither.
3. **The status file was updated.** `~/bcf/SETUP-STATUS.md` is the hand-off to the next session, and to you tomorrow.

### E.7 Resuming on a later day

Each phase is best started as a new conversation. For the first conversation of any later day, paste this instead of the whole kickoff:

```text
You are my senior pair engineer. Do not run anything yet. Read ~/bcf/SETUP-STATUS.md, then my project memory, then tell me in one table where each phase stands: state, evidence, what you need from me. Wait for my go-ahead.
```

To return to a conversation instead, run `claude --resume` in `~/46-wide_research_test` and pick it from the list, or `claude -c` to continue the most recent one.

### E.8 When the agent is stuck

| What you see | What to do |
|---|---|
| It repeats a failed command | Ask: "What is the exact error, from the log? Stop retrying and explain it." Then decide together |
| It claims something works that you doubt | Ask for the command that proves it, run it yourself in a Terminal, and compare |
| It wants to change the brain's code | It must propose the change first. Say "show me the diff and wait" |
| The conversation has become long and slow | Ask it to update `~/bcf/SETUP-STATUS.md`, then start a new conversation with the resume prompt of section E.7 |
| It is denied an action that is clearly inside your workspace | Your memory note about the auto-mode check describes why that happens with your gateway. Approve by hand, or switch to the permission mode that skips prompts while you watch |
| A download or a run died with the window | It ran outside tmux. Ask for it again inside a tmux session |

---

---

## F. Continuing: environments, data, model, the live run, local tests, the improvement loop, submission

This section is the bridge between "the machine is set up" and "the work continues". It gives the order of what remains, settles the places where the attached documents disagree with each other or with this package, and then attaches those documents in full.

There are two sources of procedure for what comes next, written a few hours apart on the same day:

- **The setup and run guide of 2026-11-24** (attached as F1). It covers the environment, the model server, the smoke panel, the panel runs, the loop and the submission.
- **The test sets playbook of 2026-11-25** (attached as F9 to F16). It was written for beginners on this same machine. It splits the environment in two, adds the data set of private test sets, and supplies the tools that run a set, compare two versions and rotate sets.

The playbook extends the guide, and in two places it corrects it. This section says which to follow where.

### F.1 The order of the remaining work

Claude Code does these phases with the prompts of section E. You approve, supply keys and watch.

| Phase | What happens | Time, about | Depends on | Read |
|---|---|---|---|---|
| 0 | Orientation. The agent reads the install log, checks each tool with a real command, and writes `~/bcf/SETUP-STATUS.md` | 10 minutes | Sections C and D | This guide |
| 1 | Loose ends: the two keys if still missing, the graphics driver, GitHub sign-in | 10 minutes | Phase 0 | Sections A and D |
| 2 | Two Python environments on Python 3.12.13: `~/bcf/.venv` for the model server and `~/bcf/.venv-harness` for the harness. The competition's wheelhouse of 41 packages feeds both | 30 to 60 minutes, mostly downloads | Phase 1 | F9, steps 5, 7, 8 and 12 |
| 3 | Downloads: the competition data package (22 GB), the FreshSWE-Py data set (7 GB) and the model (17 to 18 GB) | 45 minutes to 2 hours | Your Kaggle token | F1, step B.5, and F9, steps 6 and 9 |
| 4 | The brain and the playbook in place. Both versions of the brain built, tested and validated with the competition's own compiler. The playbook's self-test and acceptance checks | 25 minutes | Phase 2 | F1, steps B.7 and section 8, and F9, steps 4, 11 and 13 |
| 5 | The sandbox images, the gate on the first test set, the model server, the first tasks and the smoke panel | 1 to 2 hours; the first start of the server compiles kernels | Phases 3 and 4 | F9, step 10; F10; F1, section 6 |
| 6 | The live run: the naive agent against both versions of the brain on one public task, three repeats each | 1 to 2 hours | Phase 5 | F2, and section F.3 here |
| 7 | Read what the model actually decided, call by call | 1 hour | Phase 6 | F2 and F5 |
| 8 | The test sets: slices, paired comparisons, rotation, and the improvement loop | A day per loop | Phase 7 | F11 to F14, F5, F7, F8 |
| 9 | Submission | 1 hour, then 26 to 29 hours of scoring | Phase 4 for the first one | F1, sections 9 to 11, and F4 |

The times are estimates. The first run of each phase is also a test of the step itself, because none of these phases has run on the G914 yet.

**Do this first, today, on any machine.** The competition's entry and team-merger deadline is 2026-11-25 23:59 UTC, which is tonight. If you have already entered, nothing to do. If not, enter before then: no later step matters otherwise. Check the date on the competition's Timeline page, because this guide read it on 2026-11-25.

### F.2 What to know before you follow the attached documents

The attached documents were written by several runs of work over five weeks. They agree on what matters and differ in some details of layout. This is the reconciled list. Where two disagree, the right-hand column says which to follow.

| Topic | The documents say | Do this |
|---|---|---|
| One environment or two | F1 puts the model server and the harness in one environment, `~/bcf/.venv`. F9 splits them in two | **Follow F9.** The reason is in the next paragraph |
| Where F1 says to activate | F1 runs every harness command after `source ~/bcf/.venv/bin/activate` | Before a harness command, activate `~/bcf/.venv-harness` instead. The server alone lives in `~/bcf/.venv` |
| Folder layout | F6 (2026-10-31) uses `~/rig-venv` and `~/rig`. F1 uses `~/bcf`. F9 uses `~/bcf` and adds a second environment and `~/bcf/playbook` | Follow F9. It is F1's layout with two additions. The installer created `~/bcf` with the folders F1 expects |
| Installation | F1 steps B.1 to B.3, and F9 steps 1 to 3, install Zorin, the driver and the base tools | Already done: sections A and C, and stage 10 of the installer with `--with-docker`. Start F1 at step B.4 and F9 at step 4 |
| Where the packages are | F1 says "this package" | `~/bcf/packages/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity`. The earlier brain is `~/bcf/packages/2026-11-23_BCF_Brain_and_Dataset_RCA`. The playbook is `~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook` |
| The package's tools and the playbook | F1 runs `tools/run_panel.py` from inside `~/bcf`. F9 expects the playbook at `~/bcf/playbook` and F1's tools at `~/bcf/tools` | `mkdir -p ~/bcf && cp -r ~/bcf/packages/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/tools ~/bcf/tools && cp -r ~/bcf/packages/2026-11-25_BCF_Test_Sets_Playbook ~/bcf/playbook`. So F9's step 4 is done without the Windows disk |
| Two data sets | F1 step B.5 downloads the competition's data package. F9 step 6 downloads FreshSWE-Py | Download both. The first holds the 129 public tasks, the published fixes for the rig-health check, the panels and the live run. The second holds the private test sets P20, B40 and R1 to R4. The first unpacks into `~/bcf/data`, the second into `~/bcf/data/freshswe-py` |
| Two sandbox images | F1 step B.6 builds `swebench-sandbox:latest` from the competition package. F9 step 10 builds `freshswe-sandbox:latest` from FreshSWE-Py | Build both when you reach them. Each data set needs its own. The live run needs neither by default: it uses the plain sandbox |
| The graphics driver | F1 step B.2 installs driver 580. F6 and F9 prefer the "(proprietary)" variant | Section A, step 8. For the RTX 5090 the driver's kernel part must be the variant whose name ends in `-open`. If `nvidia-smi` fails after F1's step B.2, that is the reason |
| The model | F1 says to download it from Hugging Face | F9 step 9 says the same and adds that the repository is public. Checked for this guide: not gated. No Hugging Face account is needed |
| Docker's catalog | F6 and F9 step 10 add it with a one-line `.list` file | The installer already added it as a `.sources` file. Do not add it twice. The sandbox images remain |
| The live-run kit | F2 says "copy this folder's contents" | They are at `~/bcf/packages/2026-11-25_BCF_Naive_vs_Brain_Hypothetical_vs_Actual/live-run-kit`. Copy the folder to `~/bcf/live-run-kit` |
| The harness wheels | F9 step 8 takes four wheels from the wheelhouse | The same four are in `~/bcf/wheels-harness`, put there by the installer, in case the wheelhouse download is slow |
| The validator | F1 section 8 runs `tools/setup_validate_venv.py` from the brain's folder | It makes an environment of its own, and it is in each brain's `tools/` folder, not in the package's |

**Why it works this way: two environments.** The competition's harness and its model server want different versions of the same libraries. The harness package `google-adk` 1.36.1 declares, to take two examples, `mcp` below 2 and `starlette` below 1.0. Kaggle's wheelhouse pins the serving stack to newer ones. On Kaggle that is harmless, because the notebook installs the wheelhouse with dependencies switched off, on top of an image that already holds everything else. A fresh machine has no such image. So the one-environment recipe of F1 stops at its own import check: about 150 packages that the harness imports are simply not there.

Two environments avoid all of it. The server's environment holds the serving stack exactly as Kaggle has it. The harness's environment holds the four harness packages and a list of about 155 dependencies resolved on their own, which the playbook installs and then proves by importing every module the harness uses. That harness environment was built from scratch on Windows during the test sets run, in 223 seconds.

**What is not true, so that it is not repeated.** The playbook says that a strict resolver refuses vLLM 0.19.1 and `google-adk` 1.36.1 together. That holds for the wheelhouse's pinned versions, not for the two packages. Given a free choice of versions, uv resolved them into one environment for Linux and Python 3.12 when this guide was written, from package metadata alone. That single environment has never been built, and it would not be Kaggle's wheelhouse. Two environments remain the recommendation, because that is the recipe that was tested.

### F.3 The live run: the naive agent against the BCF brain

**The question it answers.** The competition ships a sample agent. Call it the naive agent. Your work is a different agent, the BCF brain, in two versions. Everything measured so far was measured with the model's choices written by hand, because the Windows machine has no card that can serve the model. The live run is the first time the real model makes its own decisions through the real harness.

**What is already known, from the real harness without the model.** On the public task `httpx_3672`, with each agent's calls scripted by hand from its prompt's own rules:

| Agent | Tool calls, charged | Result | Patch |
|---|---|---|---|
| Naive agent | 43, of which 40 charged | Not resolved: 5 of 24 graded tests fail | 2,851 bytes |
| BCF brain of 2026-11-23 | 13, of which 12 charged | Resolved: 24 of 24 | 7,549 bytes |
| BCF brain of 2026-11-24 | 13, of which 12 charged | Resolved: 24 of 24 | 7,549 bytes |

The scripted brain needed 13 calls against 43, and about one-seventh of the tool text (1,730 tokens against 12,455). That is what the prompts ask for. The live run shows whether the model follows them.

**The procedure.** Each step is the agent's phase in parentheses.

1. Both brains built (phase 4). The earlier brain lives at `~/bcf/brain-v1123`, the patched one at `~/bcf/brain`.
2. The model server started with three extra flags (phase 5). The naive agent ships two small adapters and needs them: `--enable-lora --max-loras 8 --max-lora-rank 128`. They are harmless for the brains.
3. The kit in place (phase 6):

   ```bash
   cp -r ~/bcf/packages/2026-11-25_BCF_Naive_vs_Brain_Hypothetical_vs_Actual/live-run-kit ~/bcf/live-run-kit
   cd ~/bcf/live-run-kit && cp settings.example.json settings.json
   ```

4. A preflight that costs one GPU request and proves four things (phase 6): the server answers with the right model name, the model returns a tool call, the harness is in this environment, and `bash` is where the harness expects it. The harness commands run in the harness environment:

   ```bash
   source ~/bcf/.venv-harness/bin/activate
   python scripts/preflight.py --settings settings.json
   ```

5. The run itself (phase 6). Nine runs, inside tmux. It resumes if interrupted:

   ```bash
   tmux new -s live
   python scripts/run_live.py --settings settings.json --name live-01 --tasks httpx_3672 --bundles v1123 v1124 naive --repeats 3
   ```

   Leave the window with Ctrl and B, then D. Come back with `tmux attach -t live`.
6. Reading the decisions (phase 7). Each run folder holds `decisions.md`, one row per tool call the model made, and `live_vs_scripted.md`, which lines the live calls up with the scripted ones and marks each `same`, `live only` or `scripted only`.

**The moment to watch.** The task orders a rename. A correct fix makes the visible test file fail, because the visible tests still use the old name; the grader swaps in hidden tests. Neither the brain's prompt nor the sample agent's prompt says what to do at that moment. So the first red test is where the model is on its own.

| What the model does at the first red test | Graded result, as measured |
|---|---|
| Keeps the rename and submits | Resolved |
| Adds an alias so the old name still works, then submits | Resolved, two calls later |
| Undoes the rename | Not resolved |

If several repeats undo the rename, the brain has a gap that costs the task. The package's document `03_How_the_Brain_Improves_on_Naive.md`, section 5, has the one-sentence rule that closes it.

**Rookie mistake.** Reading the token totals as money. One trace entry can carry the same usage as its neighbour. Use them to compare runs with each other only.

### F.4 Local tests: seven kinds, and what each one proves

Two data sets mean two families of tests. The public tasks come from the competition and use F1's tools. The private sets come from FreshSWE-Py and use the playbook's tools.

| Kind | What runs | The model? | What it proves | Where |
|---|---|---|---|---|
| Build-time checks | Assemble the helper, build the six bundles, 37 unit tests, the competition's own compiler on each bundle, and 15 deliberately broken bundles that the validator must reject | No | The bundle is well formed. The cheapest check, so it runs after every change | F1 section 8, F4 |
| Rig health, public tasks | The published correct fixes for the 129 tasks, run through your own sandbox | No | That your environment grades the competition's tasks fairly. About 127 of 129 should pass before any agent result is believed | F6 section 1 |
| The gate, private sets | For each private set, its reference fixes and its empty patches, through the harness's own grader in the sandbox image the agent will use | No | The same, for that set: reference fixes resolve 20 of 20, empty patches 0 of 20 | F10, step 2 |
| Smoke | Five public tasks with the model. Then one and three private tasks | Yes | That everything is wired: server, harness, sandbox, trace | F1 section 6, F10 steps 5 and 6 |
| Noise | The same version twice on the same five tasks | Yes | How much two identical runs differ. A change must be larger than this to count | F10, step 7 |
| Comparison | Public: 30 tasks, three times per bundle, pair by pair. Private: two versions on the same slice, paired task by task with a sign test | Yes | Whether a change helps, and by how much | F1 section 7, F13 |
| Confirmation | A larger set that took no part in the tuning: the 30-task public panel, or B40 | Yes | That the change did not learn one set by heart | F1 section 7, F14 |

**The slices.** Each private set of 20 tasks is cut in advance into smaller parts, each keeping the set's mix of easy and hard tasks: `smoke_1` (1 task), `smoke_3` (3), four slices of 5, two halves of 10, and the full set. The small ones sit inside the larger ones. A loop runs on a slice of five and takes about 25 minutes. The full set takes about an hour and a half. F12 has the whole scheme and the command that cuts more.

**Four rules that save a day.**

1. **Never round.** The leaderboard truncates. One task is 0.0172, not 0.02.
2. **Rig health gates everything.** Until the published fixes pass in your sandbox, you are measuring your environment. The gate of each private set comes before any run on that set, in the same sandbox image.
3. **One change at a time, with the adopt condition written down before the run.**
4. **Five pairs cannot prove anything.** A result of 5 to 0 on a slice is a loop result, not a decision. Six pairs at 6 to 0, ten at 9 to 1, or twenty at 15 to 5 reach the usual threshold. F13 has the table.

### F.5 The improvement loop

One loop is one day, in this order. The playbook's tools do the bookkeeping.

| Step | What you do | Output |
|---|---|---|
| 1 | Read the last comparison: outcome class per task, the paired table, the tasks that changed, the tokens and the calls | A list of failures sorted by how often they repeat |
| 2 | Name the failure class with the shared vocabulary, and choose the one lever that addresses it | One sentence: "tasks fail because X; change Y" |
| 3 | Write the adopt condition before you run | For example: "adopt if the paired table shows at least three more tasks resolved in two of three runs, and no task that was resolved before now fails" |
| 4 | Change the brain, then build, test and validate (the first kind of local test) | A new bundle and its SHA-256 |
| 5 | Run the same part of a set with the new version, in the harness environment: `python3 tools/run_set.py --set P20 --part slice_A --version v2`. Whenever timing matters, one task at a time | A result folder, never overwritten |
| 6 | Pair the two runs task by task: `python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1 --name v1 v2` | The paired table |
| 7 | Read it against the adopt condition. Adopt or drop | A line in the ledger: `python3 tools/ledger.py` |
| 8 | Once adopted on a slice: a new set for each new comparison, so the change is not tuned to one set. Then B40 to confirm | A confirmed or withdrawn change |
| 9 | Submit the confirmed bundle, and record its SHA-256 in the ledger | A pending submission |

F7 explains the vocabulary of failure classes and how each maps to a lever. F8 ranks the levers by return against effort, and says what not to spend time on. F14 gives the rotation: which set to use for which question, so that no set answers the same question twice.

### F.6 Submission, and the dates that matter

The competition is a code competition: the submission is made from inside a Kaggle notebook, which packages the bundle into `submission.zip`. F1 sections 9 to 11 walk through it, and F4 section 11 has the checklist.

| Date, UTC | What | Where it is from |
|---|---|---|
| 2026-11-25 23:59 | Entry and team-merger deadline | F1 section 10.3. Re-check the Timeline page |
| Every day | At most one submission. A pending one blocks the next | F1 section 10.3 |
| 2026-12-02 23:59 | At most two final submissions must be selected by then | F1 section 10.3 |
| 26 to 29 hours after each submission | The score appears | F1 section 10.3 |

Two facts that protect a week of work:

- **A score of 0.00 with a result size of about 3,230 bytes means a backend failure.** Resubmit the same file. Do not change the bundle in response.
- **Count backwards from the deadline.** A submission made on 2026-12-01 may score on 12-02. One made on 12-02 will not. The last day to submit anything you might select is therefore 2026-12-01, and earlier is safer.

### F.7 A day-by-day plan to the deadline

A plan for seven days, written on Wednesday 2026-11-25. Shift it as life requires, but keep the order.

| Day | On the machine | By the evening you have |
|---|---|---|
| Wed 11-25 | Enter the competition if you have not. Read sections A to D on any machine. Start Windows Update on the G914 | This guide read, and a G914 that is up to date |
| Thu 11-26 | Section A: dual boot. Sections C and D: the lift-and-shift. Section E: phases 0 and 1 | Zorin beside Windows, your setup restored, an agent that knows where it is |
| Fri 11-27 | Phases 2 to 5 | Two environments, both data sets, the model, both brains validated, a gate passed, a clean smoke run |
| Sat 11-28 | Phases 6 and 7. Then phase 9 once, with the bundle that is already validated | The live run read, and a first submission on the board |
| Sun 11-29 | Phase 8, loop one, on P20 | One change adopted or dropped, with evidence |
| Mon 11-30 | Phase 8, loop two, on a rotation set. A submission | A second data point from the leaderboard |
| Tue 12-01 | The last loop that can still be submitted, and B40 to confirm it. Submit before the evening | Your best bundle submitted, confirmed on a set it was not tuned on |
| Wed 12-02 | Select the two finals. Stop | Done |

**Why submit early with an old bundle.** The first leaderboard value tells you things no local run can: whether the agent's skill scripts run on the scorer at all, and how many hours the run takes there. It costs one of your daily submissions and answers questions that would otherwise wait until the last day.

### F.8 The attached documents

Each is attached in full below this table. The first eight come from the setup, validation and analysis runs. The last eight are the test sets playbook, in its own order.

| Label | Document | Written | Read it for |
|---|---|---|---|
| F1 | Setup, install and run guide: the local test harness for the BCF brain on a PowerSpec G914 | 2026-11-24 | The server environment, the model server's flags, the smoke panel, the public panel runs, the loop, the submission notebook. Its one-environment steps are superseded by F9: see section F.2 |
| F2 | Live-run playbook: watch the BCF brain make its own decisions on the RTX 5090 | 2026-11-25 | Phases 6 and 7. The preflight, the run, and how to read the decisions |
| F3 | Zorin OS 18 setup: the RTX 5090 native-Linux rig | 2026-10-31 | The driver in detail, sharing data with Windows, and the eight Zorin pitfalls |
| F4 | Validation results and submission playbook | 2026-11-24 | What was tested on the brain's code and with what result. The submission checklist |
| F5 | Scoring and evaluating local runs | 2026-11-24 | How to read a result folder, what a local number can and cannot tell you, and how it becomes a tuning decision |
| F6 | Testing trials, metrics, and result analysis | 2026-10-31 | Which numbers matter, which are noise, and how local scores relate to the leaderboard |
| F7 | Improving the BCF brain from each run: the ledger to config loop | 2026-10-31 | The improvement loop in detail, and the failure classes |
| F8 | Impact-effort analysis and roadmap | 2026-11-24 | Which lever to pull next, with values, in order. Its calendar was written for the same deadline |
| F9 | Playbook 1: install everything on Zorin OS 18 | 2026-11-25 | Phases 2 to 4. The two environments, both data sets, the model, the sandbox image, the brain, the acceptance checks. Its steps 1 to 3 are done by sections A and C |
| F10 | Playbook 2: first run, the gate, the model server, the first tasks | 2026-11-25 | Phase 5. The gate, the server, one task, three tasks, the noise run, the first full run of a set |
| F11 | Playbook 3: the test sets | 2026-11-25 | What P20, B40 and R1 to R4 are, where they come from, and which to use when |
| F12 | Playbook 4: cut a set into slices | 2026-11-25 | The parts of every set, how the cut keeps the mix, and the command that cuts more |
| F13 | Playbook 5: compare two versions | 2026-11-25 | The paired comparison, the sign test, and what a result of each size means |
| F14 | Playbook 6: rotate and confirm | 2026-11-25 | Which set answers which question, and the final confirmation on B40 |
| F15 | Playbook 7: troubleshooting | 2026-11-25 | The symptom, the cause and the fix, from the driver to the sandbox image |
| F16 | Playbook reference | 2026-11-25 | Commands, the folder map, file formats, a glossary, sources, and what that playbook did and did not verify |

The same documents are on the G914 after the lift, under `~/bcf/packages`. The playbook also has its own single-file guide, `BCF_Test_Sets_Guide.html`, in its package. The Windows track of F1 (section 4) and the Windows setup guide of 2026-10-31 are not attached here, because you chose Zorin. They are in the packages if you want them.

*The sixteen documents are attached in full at the end of this file, after section H, as F1 to F16. In the web page version of this guide they are folded closed here instead.*

---

---

## G. User journeys: six days of work, walked through

A procedure tells you what to do. A journey tells you what it feels like, where the day usually goes wrong, and how to tell that you are on track. Each one below has checkpoints: the moment you know the day is working.

### G.1 Journey 1: the evening before

You have two or three hours and the G914 is still in its box, or just set up. Nothing is installed on the Zorin side, because there is no Zorin side yet.

| When | You do | You think |
|---|---|---|
| 0:00 | Unbox, plug in, switch on. Set up Windows with your Microsoft account | "Why does it want an account?" That account is where the recovery key will be stored, so it is on your side |
| 0:20 | In Windows: Settings, Windows Update, Check for updates. Let it run | This is the slow part and it needs none of you. Start it first |
| 0:25 | On your old PC, read sections A and B of this guide once | Half of it will make more sense the second time |
| 0:50 | Back on the G914, with updates still running: section A, step 1. Find out whether the disk is encrypted. Save the recovery key in two places | "It is encrypted. I never asked for that." Everyone says that. It is fine, now that you have the key |
| 1:10 | Updates are done, after a restart or two. Section A, step 2: encryption off, Fast Startup off | The decryption percentage, watched for a minute, then ignored |
| 1:20 | Section A, step 3: shrink the disk. Type the number, read it twice, Shrink | "Is 1,100,000 the right number?" It is the Recommended row of the table. Windows keeps about 790 GB |
| 1:25 | Section A, steps 4 and 5: download Zorin, check it, write the USB stick | The checksum matches. A small win |
| 1:55 | Decide: carry on tonight, or stop here | Stopping here is a fine choice. Nothing is half done |

**You are on track if:** the recovery key exists in two places you could reach with the PC switched off, Disk Management shows a black unallocated block, and the stick is written.

**Where this evening usually goes wrong.** Skipping the key because the disk "is new, there is nothing on it". The key protects the machine, not the files. Without it a firmware change can turn a new PC into a brick until it is reset.

### G.2 Journey 2: install day

| When | You do | You think |
|---|---|---|
| 0:00 | Section A, step 6: one look at the firmware. Photo of each page | The keys look different from Windows. Nothing here needs you; look and leave |
| 0:05 | Section A, step 7: boot from the stick. The Zorin menu, the choice with NVIDIA drivers, the check | The check takes a minute. It is worth it |
| 0:15 | The installer. Language, keyboard, internet, third-party software ticked | |
| 0:20 | Installation type. "Install Zorin OS alongside Windows Boot Manager". Read it three times | This is the one screen where the wrong click costs everything |
| 0:25 | Install Now. Write the changes. Your name and a real password. Wait | Twenty minutes for a coffee |
| 0:50 | First boot: the menu with Zorin and Windows. Into Zorin | It looks like a normal computer already |
| 0:55 | Section A, step 8: is the NVIDIA driver active? `nvidia-smi` names the RTX 5090 | If it does, skip ahead. If not, the Additional Drivers steps, and remember the `-open` variant for this card |
| 1:15 | Updates. The clock fix. A restart into Windows and back, to prove both start | Two systems, one machine, nothing lost |
| 1:40 | Section A, step 9: the layout you like, backups switched on, encryption back on in Windows | |

**You are on track if:** `nvidia-smi` shows the card with a driver that starts with 580, the Zorin clock is right, and Windows still starts.

**Where this day usually goes wrong.** Choosing "Erase disk and install Zorin OS". It is the option above or below the one you want. Read the installation type screen aloud before you click.

### G.3 Journey 3: the first working day

The machine is yours again, with your tools on it.

| When | You do | You think |
|---|---|---|
| 0:00 | Section C: carry the two zips over, check them, unpack them | A handful of commands and almost no typing of paths. That is the point of the package |
| 0:10 | The dry run. Read it | Eleven stages. It all looks reasonable |
| 0:15 | The real run. Your password once. Wait | Five to ten minutes |
| 0:25 | Read the summary. Then delete the credentials folder | |
| 0:30 | Section D: VS Code, the extension, the five-minute check of section D, step 8 | The agent knows my research rules. It remembers the competition |
| 0:45 | Section E: paste the kickoff prompt | It reads the install log and writes a status table. Phase 0 done |
| 1:00 | "Go on." Phase 1: the agent checks the driver and the keys, and starts `gh auth login` for you | It stops and asks you to type a code into the browser. You do. It carries on |
| 1:15 | Phase 2: two environments, one for the model server and one for the harness. Downloads inside tmux | You watch a log scroll. This is what most of the week looks like |
| 1:45 | Phase 3: the agent asks for a Kaggle token. You create it on kaggle.com. Three big downloads start | 22 GB, 7 GB and 18 GB. Go and do something else |
| Later | The agent reports the three downloads complete, with the file counts | |

**You are on track if:** the agent's status table shows phases 0 to 3 as done, each with evidence, and `~/bcf/SETUP-STATUS.md` exists.

**Where this day usually goes wrong.** Leaving the laptop of your old life: closing the Terminal while a download runs. The agent uses tmux, but if you type a command yourself, remember section B.5.

### G.4 Journey 4: the live-run day

Today the model decides for itself for the first time.

| When | You do | You think |
|---|---|---|
| 0:00 | "Go on." Phase 4: both brains built, tested and validated. The playbook's self-test passes | Six bundles compile. 36 tests pass. The compiler agrees six times out of six |
| 0:15 | Phase 5: the gate on the first test set. It calls no model. The reference fixes resolve 20 of 20 | The environment grades fairly. Now a result means something |
| 0:30 | The server starts in tmux. The first start takes minutes while it compiles | Read the log. The line that says the server is started is the one to wait for |
| 1:00 | The smoke panel: five public tasks, then one private task | Six tasks, six results, no harness error. Wired correctly |
| 1:20 | Phase 6: the preflight, four PASS lines. Then the live run starts | Nine runs. Up to eight minutes each |
| 2:30 | The run finished. Phase 7: the agent reads the decisions | |
| 2:45 | You read one `decisions.md` yourself. Thirteen rows. The installer ran, the spec came through word for word, the first edit at call 4 | It did what the prompt asked. Or it did not, and now you know exactly where |
| 3:15 | The table of all nine runs: which kept the rename, which added an alias, which undid it | The decision at the first red test, nine times |
| 3:45 | You decide what the single most important change to the brain is | With evidence, in the ledger |

**You are on track if:** every run folder has its four files, and you can name in one sentence what the model did at the first red test in each.

**Where this day usually goes wrong.** A server started by hand in a Terminal, then the Terminal closed. Or two servers on one port. The kickoff prompt forbids both. Let it.

### G.5 Journey 5: the improvement loop

A repeating day. Each pass makes one change and measures it honestly.

| When | You do | You think |
|---|---|---|
| Morning | "Resume." The agent reads the status file | Fresh conversation, full memory |
| 0:10 | Phase 8: it proposes one change and an adopt condition, and waits | You read both. "Adopt if the paired table shows three more tasks resolved, and none lost." Clear enough |
| 0:20 | You approve. It changes the brain, builds, tests, validates | It shows the diff first. You skim it |
| 0:40 | A slice of five tasks from P20, with the new version and the old one. About 25 minutes each | Under an hour and a half. Leave it |
| Afternoon | The comparison tool prints the paired table. Met, or not met | One of the two. Either way you learned something |
| Later | If adopted: a new set for the next comparison, and phase 9 for this bundle. The dataset version, the notebook version, Submit | One submission a day. This is today's |
| Evening | The ledger has a new line with the bundle's SHA-256 | Tomorrow the score arrives |

**You are on track if:** the ledger grew by one line, and the line says whether the change was adopted.

**Where this day usually goes wrong.** Changing two things and not knowing which one helped. Believing a result of five tasks. Or reading the leaderboard as a local number: it is one draw, with a spread of about four tasks.

### G.6 Journey 6: when something breaks

It will. The table says where to look first.

| What broke | First look | Then |
|---|---|---|
| Windows will not start; a blue screen asks for a recovery key | The two copies you made in section A, step 1 | Enter the key. Then check in Windows that encryption is in the state you want |
| The PC starts Windows every time | F11 at power-on, pick Zorin | Change the boot order in the firmware |
| `nvidia-smi` fails after an update | A kernel update arrived. Restart | If it still fails, section A, step 8, and the `-open` variant |
| A Terminal says "command not found" for something just installed | The Terminal is older than the install | Open a new one |
| The installer stopped on a red XX | `~/g914-install.log` | Section C.7 |
| Claude Code shows a sign-in screen | The token placeholder | Section D.3 and D.4 |
| The agent says "done" with no evidence | It is guessing | "Show me the output." Every time |
| The model server is not answering | `~/bcf/vllm-31b.log` | F1 section 14, and F15 |
| A reference fix does not resolve in the gate | The environment, not the agent | F10, step 2. Then F15 |
| `No module named` inside a call the harness makes | The harness environment is incomplete | F9, step 12: run `finish_env.py` again. Then F15 |
| `swegemma` will not import in `~/bcf/.venv` | Expected. The harness lives in its own environment | Activate `~/bcf/.venv-harness`. Section F.2 explains |
| Every task gets 60 minutes | The run went through the bare eval command | Use the panel tool, as F1 section 6 does |
| The submission scored 0.00 | The result size | About 3,230 bytes: a backend failure. Resubmit the same file |
| You are tired and it is late | The status file | Update it, stop, resume tomorrow with the prompt of section E.7 |

---

---

## H. Reference

### H.1 Troubleshooting the lift itself

Section G.6 is the short list for the whole week. This is the longer list for the lift and for Linux itself.

| Symptom | Cause | Fix |
|---|---|---|
| `sha256sum` says FAILED for a zip | The copy was damaged, or an older build is on the stick | Copy again from the deliverables folder. Compare with the hashes in section C.3 |
| `unzip: command not found` | Zorin has it. A minimal system does not | `sudo apt install unzip`, or use Files: right-click the zip, Open With Archive Manager |
| `bash: install.sh: No such file or directory` | You are in the wrong folder | `cd ~/lift/g914-lift-and-shift` |
| `$'\r': command not found` | A file with Windows line endings | The package was converted. If you edited a script on Windows: `sed -i 's/\r$//' <file>` |
| `Permission denied` when you double-click the installer | Executing from the stick or from Files | Run it as the guide does, with `bash install.sh` from your home folder |
| "sudo: a password is required" in a loop | Your account is not an administrator | Use the administrator account from step A.10 |
| A stage says a repository has "no Release file" | A catalog changed after this guide was written | Open the stage in `install.sh`, compare its address with the vendor's page in section H.3, correct it, re-run that stage |
| The installer stops at "Package incomplete" | The zip did not unpack fully | Unpack again |
| VS Code ignores the settings that were restored | VS Code was installed from the Software store as a Snap before the installer ran. A Snap keeps its settings elsewhere | Remove it in the Software store, then run `bash install.sh --only 3`. The installer's VS Code is the standard one |
| Chrome will not start from the research toolkit | No driver yet, or a Wayland problem | Complete section A, step 8 first. Then try the Xorg session (step A.11.3) |
| A page fetch works in a Terminal but not from the agent | The agent's shell lacks a new path | Start a new session after installing anything |
| The clock in Windows is some hours off after using Zorin | The clock fix was not applied | Section A, step 8: the `timedatectl` command |
| The Windows partition opens read-only | Fast Startup is back on, usually after a Windows update reset it | Windows: repeat step A.5.2. Then in Zorin unmount and remount the partition |
| No sound, wrong scale, a printer | Desktop matters, outside this guide | Zorin's help centre, linked below. Its articles are short and follow the same style as the ones quoted here |
| You need to get back to Windows for a day | Nothing is lost | Restart and pick Windows Boot Manager. Your Zorin files wait |

### H.2 A checklist to print

One page. Tick as you go.

| Done | Step | Where |
|---|---|---|
| | Entered the Kaggle competition | Section F.1 |
| | Windows Update finished | A.4.1 |
| | Files backed up to another drive | A.4.2 |
| | Encryption status known | A.4.3 |
| | Recovery key saved in two places off the PC | A.4.4 |
| | Device encryption off, decryption finished | A.5.1 |
| | Fast Startup off | A.5.2 |
| | Windows partition shrunk, unallocated block visible | A.6.2 |
| | Zorin OS 18.1 downloaded, checksum matches | A.7 |
| | USB stick written | A.8 |
| | Firmware checked, Fast Boot off, photos taken | A.9 |
| | Zorin installed alongside Windows | A.10 |
| | Boot menu shows both systems | A.11.1 |
| | `nvidia-smi` names the RTX 5090 | A.11.2 |
| | Updates installed, clock fixed | A.11.4 and A.11.5 |
| | Backups switched on | A.12.3 |
| | Device encryption back on in Windows | A.12.4 |
| | Both zips copied, both OK | C.3 |
| | Dry run read | C.4 |
| | Installer finished, eleven PASS | C.5 |
| | Logged out and back in once, for the docker group | C.5 |
| | Credentials folder deleted | C.9 |
| | VS Code opens the workspace | D.1 |
| | Claude Code answers "hello" | D.4 |
| | Toolkit health check passes | D.5 |
| | Git identity copied, GitHub and Kaggle signed in | D.7 |
| | The five-minute memory check answered correctly | D.8 |
| | Kickoff prompt pasted, phase 0 done | E.3 |

### H.3 Sources

Every external fact in this guide was read from one of these pages on 2026-11-25. Quotations keep the wording of the page. If a page has changed by the time you read this, the page wins.

**The machine**

| Source | Publisher | Used for |
|---|---|---|
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | The parts: Windows 11 Pro, Ryzen 9 9950X3D, RTX 5090 with 32 GB, 64 GB, 2 TB NVMe, AMD X870E |
| [G914 Gaming PC](https://www.microcenter.com/product/698934/g914-gaming-pc) | Micro Center | The motherboard: MSI MAG X870E Tomahawk WiFi |
| [How to set up or remove a BIOS lock password](https://www.msi.com/faq/faq-11288) | MSI | The Delete key enters BIOS setup; F10 saves and restarts |
| [Where is the hot key for boot menu display?](https://www.msi.com/faq/nb-901) | MSI | F11 shows the boot menu. The article's model list is from 2014 |
| [Chapter 45, Open Linux Kernel Modules](https://download.nvidia.com/XFree86/Linux-x86_64/580.82.09/README/kernel_open.html) | NVIDIA, driver 580.82.09 README | Blackwell is "only supported by the open kernel modules"; the two flavours must not be installed together |

**Zorin OS**

| Source | Used for |
|---|---|
| [Install Zorin OS](https://help.zorin.com/docs/getting-started/install-zorin-os/) | The installer, the USB stick, the NVIDIA boot option, "alongside" and "Something else" |
| [System Requirements](https://help.zorin.com/docs/getting-started/system-requirements/) | Minimum hardware |
| [Manually Partition the Drive to Install Zorin OS](https://help.zorin.com/docs/getting-started/manually-partition-the-drive-to-install-zorin-os/) | The manual partitioning steps and the boot loader device |
| [Activate NVIDIA Graphics Card](https://help.zorin.com/docs/hardware/activate-nvidia-drivers/) | Driver 580, Additional Drivers, how to verify, Xorg, Secure Boot |
| [Error While Installing Zorin OS](https://help.zorin.com/docs/getting-started/error-while-installing-zorin-os/) | Fast Startup and Fast Boot, Secure Boot, a drive the installer cannot see |
| [Unable to Boot From the USB Install Drive](https://help.zorin.com/docs/getting-started/unable-to-boot-from-the-usb-install-drive/) | The boot menu, Secure Boot, black screens |
| [Fix "No Bootable Device" Error After Installing Zorin OS](https://help.zorin.com/docs/getting-started/no-bootable-device-error-after-installation/) | Referred to for that error; not read for this guide |
| [Repair the Boot Loader](https://help.zorin.com/docs/getting-started/repair-the-boot-loader/) | Referred to for a missing boot menu; not read for this guide |
| [Check the Integrity of Your Copy of Zorin OS](https://help.zorin.com/docs/getting-started/check-the-integrity-of-your-copy-of-zorin-os/) | The SHA-256 of the 18.1 Core image, QuickHash |
| [Fix System Clock Out of Sync With Time on Windows](https://help.zorin.com/docs/system-software/fix-system-clock-out-of-sync-with-windows/) | The clock fix |
| [Back Up Files](https://help.zorin.com/docs/getting-started/back-up-files/) | The Backups app, the three-places rule |
| [Install Apps](https://help.zorin.com/docs/apps-games/install-apps/) | The Software store's sources, `.deb`, AppImage, repositories |
| [Windows App Support](https://help.zorin.com/docs/apps-games/windows-app-support/) | Running Windows programs |
| [Alternatives to Windows Apps](https://help.zorin.com/docs/apps-games/alternatives-to-windows-apps/) | Which Linux apps replace which Windows apps |
| [Install Google Chrome](https://help.zorin.com/docs/apps-games/install-google-chrome/) | Chrome on Zorin |
| [Microsoft Fonts](https://help.zorin.com/docs/system-software/microsoft-fonts/) | Referred to only |
| [Zorin OS 18.1 Is Released](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | The release date, kernel 6.17, support to June 2029, Zorin Appearance |
| [Download Zorin OS](https://zorin.com/os/download/) | The Core and Pro editions, "View SHA256 checksums" |
| [Zorin OS](https://zorin.com/os/) | Dual boot, reading the Windows drive from Zorin, Zorin Appearance |
| [balenaEtcher](https://etcher.balena.io) and [Rufus](https://rufus.ie) | The two USB tools Zorin names |

**Windows 11: encryption, the disk, the firmware**

| Source | Publisher | Used for |
|---|---|---|
| [BitLocker overview](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/) | Microsoft Learn | Device encryption since 24H2; the recovery key goes to the Microsoft account; UEFI without CSM |
| [BitLocker recovery overview](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview) | Microsoft Learn | The events that trigger recovery; suspend and resume |
| [BitLocker FAQ](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/faq) | Microsoft Learn | Boot changes that fail the integrity check; suspend versus decrypt; PCR 7 |
| [BitLocker operations guide](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/operations-guide) | Microsoft Learn | How protection is suspended and resumed |
| [manage-bde](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/manage-bde-status) | Microsoft Learn | What `manage-bde -status` reports |
| [Device encryption in Windows](https://support.microsoft.com/en-us/windows/security/encryption/device-encryption-in-windows) | Microsoft Support | Encryption turns on with a Microsoft account; the Settings path; why it may be unavailable |
| [BitLocker Drive Encryption](https://support.microsoft.com/en-us/windows/security/encryption/bitlocker-drive-encryption) | Microsoft Support | Manage BitLocker; which editions have it |
| [Find your BitLocker recovery key](https://support.microsoft.com/windows/find-your-bitlocker-recovery-key-6b71ad27-0b89-ea08-f143-056f5ab347d6) | Microsoft Support | `aka.ms/myrecoverykey`; 48 digits; the consequence of losing it |
| [Back up your BitLocker recovery key](https://support.microsoft.com/en-us/windows/security/encryption/back-up-your-bitlocker-recovery-key) | Microsoft Support | The four backup routes |
| [BitLocker overview](https://support.microsoft.com/windows/44c0c61c-989d-4a69-8822-b95cd49b1bbf) | Microsoft Support | Changes to hardware, firmware or software can require the key |
| [Shrink a Basic Volume](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/shrink-a-basic-volume) | Microsoft Learn | Shrink Volume; unmovable files; Event ID 259 |
| [Overview of Disk Management](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/overview-of-disk-management) | Microsoft Learn | The three Windows partitions; leave EFI and Recovery alone |
| [Disabling Secure Boot](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/disabling-secure-boot) | Microsoft Learn | The Shift-and-Restart route to the firmware |
| [shutdown](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown) | Microsoft Learn | The `/fw` option |
| [powercfg](https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options) | Microsoft Learn | `/hibernate on` and `off` |
| [Distinguishing Fast Startup from Wake-from-Hibernation](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/distinguishing-fast-startup-from-wake-from-hibernation) | Microsoft Learn | A fast startup loads the hibernation file |
| [Windows Recovery Environment update, January 2024](https://support.microsoft.com/en-us/servicing/os/windows/2024/01/kb5042321-windows-recovery-environment-update-for-windows-11-version-21h2-january-9-2024) | Microsoft Support | The 250 MB free-space requirement in the recovery partition |

**The tools the installer adds**

| Source | Publisher | Used for |
|---|---|---|
| [Setup](https://code.claude.com/docs/en/setup) | Claude Code | The apt repository and its signing-key fingerprint; the native installer |
| [VS Code](https://code.claude.com/docs/en/vs-code) | Claude Code | The extension, sign-in, settings shared with the CLI, `claude mcp add` |
| [MCP](https://code.claude.com/docs/en/mcp) | Claude Code | The `claude mcp add` syntax and scopes |
| [Plugins](https://code.claude.com/docs/en/plugins) | Claude Code | Plugin marketplaces |
| [Visual Studio Code on Linux](https://code.visualstudio.com/docs/setup/linux) | Microsoft | The apt repository and the signing key |
| [Installation](https://docs.astral.sh/uv/getting-started/installation/) | Astral | The uv installer |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) | Docker | The repository and the packages |
| [Installing gh on Linux](https://github.com/cli/cli/blob/trunk/docs/install_linux.md) | GitHub | The GitHub CLI repository |
| [NodeSource distributions](https://github.com/nodesource/distributions) | NodeSource | The Node.js LTS repository script |
| [Package management](https://documentation.ubuntu.com/server/how-to/software/package-management/) | Ubuntu | The apt commands; why not to remove with dpkg |
| [Install NVIDIA drivers](https://documentation.ubuntu.com/server/how-to/graphics/install-nvidia-drivers/) | Ubuntu | The `-open` package names |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Chrome DevTools | Requirements, the configuration, the usage-statistics switch |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Microsoft | The Claude Code registration and requirements |

**The model and the data set**

| Source | Publisher | Used for |
|---|---|---|
| [The model's repository record](https://huggingface.co/api/models/google/gemma-4-31B-it-qat-w4a16-ct) | Hugging Face | That the repository is public and not gated (`"gated": false`), read on 2026-11-25 |
| The test sets playbook, `deliverables/2026-11-25_BCF_Test_Sets_Playbook` | This project, 2026-11-25 | The two environments and the reason for them, the private test sets, the gate, the slices, the sign test. Attached in full as F9 to F16. Its FreshSWE-Py facts come from that data set's own README on Kaggle |

**Checked by execution rather than read**

| Fact | How |
|---|---|
| PowerShell's `Get-FileHash` gives the same SHA-256 as `sha256sum` | Both run on the same file on the Windows machine |
| `claude mcp get` exits 0 for a registered server and 1 for an unknown one | Both run on the Windows machine |
| Every install command in the installer | Run to the end in an Ubuntu 24.04 container, section H.4 |
| What `google-adk` 1.36.1 declares, among others `mcp` below 2 and `starlette` below 1.0 | Read from the package's own metadata, inside the wheel that this package carries |
| That vLLM 0.19.1 and `google-adk` 1.36.1 can be resolved together when the resolver chooses the versions | uv 0.12.13, package metadata only, for Linux and Python 3.12: 234 packages, no conflict |

### H.4 What was verified, and how

This is the record behind the statement in section 0.3. The full version, with every check's output, is in the companion document `03_Package_Manifest_and_QC.md`.

| What | How | Result |
|---|---|---|
| The installer's syntax and style | `bash -n` and shellcheck | Clean, apart from three shellcheck notes about `sudo` and redirection that do not apply |
| The three Python fragments inside the installer | Unit tests on Windows | 12 of 12 pass |
| The installer's logic on a simulated Zorin | A dry run on Windows with Zorin's identification file and a stand-in for `sudo` | 13 of 13 checks pass: exit code 0, eleven stages PASS, the simulated system recognised, no secret printed, nothing written |
| **The installer on real Linux** | A fresh Ubuntu 24.04 container, a normal user with `sudo`, false credentials | Three complete runs. First run: 11 of 11 stages PASS in about four to five minutes. Second run: everything recognised. Third run, with `--with-docker --with-browser-mcps --all-extensions`: 11 of 11 PASS, Docker installed, the user in its group, 32 of 32 extensions, both MCP servers registered |
| The installer's refusals | Same container | Running as root exits 1. An incomplete package exits 1. An unknown option exits 2 |
| The dry run's promise | Same container, on a machine where everything was installed: every file under the home folder listed before and after a dry run with every switch on | Nothing modified and nothing created in any folder the installer manages. The only new files were 17, then 14 on a repeat, that other programs wrote for themselves: VS Code's command-line tool logs each start, and uv refreshed its interpreter cache |
| The research toolkit's browser scripts on Linux | Same container, headless Chrome | Launch, reuse, a fetch attached through the recorded browser, the pre-warm, close, a foreign listener stepped around, a foreign browser refused and never killed |
| The research toolkit's browser scripts on Windows | Before and after the change, on a test folder | Launch, reuse, close and close-by-port behave as before. The research browser in use during this work was not touched |
| The MCP servers | Same container | `claude mcp list` shows both Connected. Each answered a first request with its list of tools |
| The zips | A script that reads them as Linux would | 15 of 15 pass: no damaged file, every script executable with Linux line endings, no secret in the main zip, every file matches the manifest |
| The cross-references in this guide | A script that collects every numbered heading and every "section A.4" and "step A.4.1" in the guide | Every reference points at a heading that exists. The count is in `03_Package_Manifest_and_QC.md` |
| The final package against the tested one | SHA-256 of the scripts | The installer and the two toolkit scripts are byte-identical to the ones that ran in the container |
| The two environments of section F | `google-adk`'s declared ranges were read from its wheel, and uv was asked to resolve vLLM 0.19.1 together with it | The ranges are as section F.2 states. With a free choice of versions uv resolved both into one environment, which is why F.2 gives the reason for two environments as it does |

The zip that last ran in the container had this SHA-256:

```text
2d5d78e8fe862e9302dbf0734eb6c558b2c023a8ddf8521b791efc4d7f9542ef
```

The zip in this folder is that zip, except for two kinds of file that change whenever this workspace is written to and that the installer only copies: the memory notes and the saved conversation transcript. The installer's own SHA-256, the same in both zips:

```text
448329c81f6b92c356c8fa87317829000fa7ea42af8440d8ccb4a8af4e1170e1
```

**What none of this proves.** A fair list:

| Not tested | Why | What to expect |
|---|---|---|
| Zorin OS 18 itself | The G914 is factory-fresh | Zorin 18 is Ubuntu 24.04 underneath. Differences would show in the first minutes, as a package name the catalog does not know |
| The graphics driver | The test machine has no NVIDIA card and the container had none | Section A, step 8, with the `-open` rule for this card |
| A browser window on the desktop | The container had no display | The scripts fall back to headless when no display exists, and run headed on the desktop |
| The real keys and sign-ins | False values were used | Sections D.4, D.5 and D.7 |
| Claude Code against your gateway | No real token in the container | Section D.8 |
| Everything in section F | It needs the GPU | Each phase says what it proves |
| The two environments on Linux | The harness half of the recipe was built on Windows by the run that wrote the test sets playbook. The server half needs the RTX 5090 | F9, steps 7, 8 and 12, and F15 if something is missing |

### H.5 What else is in the deliverables folder

| File | What it is |
|---|---|
| `G914_Zorin18_Setup_Guide.html` | This guide as one web page. Self-contained: no internet, no other files needed |
| `01_Setup_Guide.md` | This guide as Markdown, the attachments included |
| `00_README.md` | Where to start, in one page |
| `02_Kickoff_System_Prompts.md` | The kickoff prompt and the phase prompts, on their own for quick copying |
| `03_Package_Manifest_and_QC.md` | Every check with its result, the manifest summary, and the table quality report |
| `zips/`, `SHA256SUMS.txt`, `SHA256SUMS.docs.txt` | The two zips; the checksums of the zips; the checksums of every other file |
| `kit/` | The installer, the kickoff prompts and the manifest, unpacked |

---

---

---

## Attached documents (F1 to F16)

The sixteen documents of section F.8, each copied in full as it was written, with their headings moved down so that they sit inside this guide.

### F1. Setup, install and run guide

*Attached in full, as written on 2026-11-24. Its own title: “Task 7 - Setup, install and run guide: the local test harness for the BCF brain on a PowerSpec G914, with official submissions for the main and the bonus track.”*

**Prepared:** 2026-11-24. **Machine:** PowerSpec G914 (AMD Ryzen 9 9950X3D, 16 cores and 32 threads; NVIDIA GeForce RTX 5090 with 32 GB; 64 GB DDR5-6000; 2 TB NVMe; AMD X870E; Windows 11 Pro as shipped). **Two tracks:** A, Windows 11 Pro with WSL2; B, Zorin OS 18.1. **Brain:** `bcf-brain-patched/` in this package.

---

##### 0. Read this first

| Item | Statement |
| --- | --- |
| What you will have at the end | One vLLM server of the exact competition build, the official harness, the 129 public tasks, a smoke panel and a ranking panel, the brain's build-and-validate loop, and a notebook that produces a valid `submission.zip` |
| What was executed for this document | The brain's build, tests, official validation, replay and probes (Windows, Python 3.12.10); the Kaggle pages, the staff notebook, the wheelhouse metadata, and the vendor and documentation pages named in section 13 |
| What was **not** executed | The install steps on a greenfield G914. They follow the official documentation of each tool and the staff Getting Started notebook; every command that this document could not run is marked "not run here". Run section 12's acceptance table once and you will know |
| Time needed | About half a day per track the first time, most of it downloads (21.9 GB of data, 17 to 18 GB of weights per model, 0.9 GB of wheels) |
| The three things that break parity if skipped | Python must be exactly 3.12.13 for the harness; the wheelhouse wheels must be installed with the notebook's two corrections; the eval must be run with the notebook's `EvalConfig` settings (`tools/run_panel.py`), not with the bare `swegemma eval` command |

---

##### 1. The pieces

| Piece | Version | Size | Source |
| --- | --- | --- | --- |
| Driver | NVIDIA 580 or newer on Linux, 570.65 or newer on Windows; the same Windows driver serves WSL2 | - | The distribution's package manager on Zorin; Windows Update or NVIDIA on Windows |
| Python | 3.12.13 for the harness; 3.13 comes from the sandbox image | - | `uv python install 3.12.13` |
| Serving stack | vLLM 0.19.1, transformers 5.13.1, flashinfer 0.6.6, compressed-tensors 0.15.0.1 and 37 more wheels | 0.88 GB | The public wheelhouse, version 31 (`metric/gemma-4-developer-agent-wheelhouse`) |
| PyTorch | 2.10.0 built for CUDA 12.8 (not in the wheelhouse; pre-installed in the Kaggle image) | about 3 GB | `download.pytorch.org/whl/cu128` |
| Harness | swegemma 0.2.11, adk-submission 0.2.13, adk-eval-core 0.1.0, google-adk 1.36.1 | in the wheelhouse | same |
| Tasks | 129 published tasks with snapshots, graphs, embeddings, test wheels and the sandbox Dockerfiles | 21.9 GB compressed | The competition's Data page (rules must be accepted) |
| Model | `gemma-4-31b-it-qat-w4a16-ct` (17 to 18 GB) and `gemma-4-e4b-it-qat-w4a16-ct` for the bonus track | - | Kaggle Models (`google/gemma-4`) or Hugging Face (`google`) |
| Brain | `bcf-brain-patched/` in this package | 76 KB per bundle | this package |
| Container tools | Docker Engine and the NVIDIA Container Toolkit (only for the Docker sandbox) | - | `download.docker.com`, `nvidia.github.io` |
| Kaggle command line | the `kaggle` package, with your API token | - | `pypi.org/project/kaggle` |

---

##### 2. Folder layout (the same on both tracks)

| Path inside Linux | Holds |
| --- | --- |
| `~/bcf/.venv` | the Python 3.12.13 environment with torch, vLLM and the wheelhouse |
| `~/bcf/models/<model name>` | the weights, one folder per model |
| `~/bcf/data/gemma-4-developer-agent/` | the unpacked data package: `tasks.jsonl`, `snapshots/`, `graphs/`, `embeddings/`, `wheels/`, `docker/`, `sandbox/`, `sample_submission/` |
| `~/bcf/brain/` | `bcf-brain-patched/` copied here, with `dist/` (the six bundles) and `tools/` |
| `~/bcf/results/<run name>` | one folder per run |
| `~/bcf/submit/` | the bundle to submit and `submission.zip` |

On Windows these paths are inside the WSL2 distribution's own file system (`\\wsl$\Ubuntu-24.04\home\<user>\bcf` from Windows), never under `/mnt/c` or `/mnt/d`: Microsoft's guidance is to keep project files in the Linux file system, and model weights read through `/mnt` load slowly. The 2 TB NVMe of the G914 holds both systems: about 120 GB for Windows and 80 GB for Zorin leaves roughly 800 GB each.

---

##### 3. Track B: Zorin OS 18.1

Zorin OS 18.1 is the current version (released 2026-04-15): Ubuntu 24.04 LTS underneath, Linux 6.17, supported to 2029. Everything written for Ubuntu 24.04 applies.

###### B.1 Install

1. Download the Zorin OS 18.1 Core 64-bit image and write it to a USB stick with balenaEtcher or Rufus (not run here).
2. Boot the G914 from the stick. In the installer choose **Install alongside Windows** (or "Something else" to size the partitions), keep the Windows bootloader, and create your user.
3. If the installer does not boot with the NVIDIA card visible, choose the "safe graphics" option on the boot menu; the driver is installed after the first boot.
4. After the first login: open **Software** and install updates, then reboot.

###### B.2 Driver

```bash
sudo apt update
sudo apt install -y linux-headers-$(uname -r) build-essential dkms pciutils
ubuntu-drivers devices                       # lists what can be installed
sudo ubuntu-drivers install --gpgpu nvidia:580
sudo reboot
nvidia-smi                                   # expect: RTX 5090, driver 580 or newer, CUDA 12.8 or later
```

Use the package manager, never a `.run` installer: the packages carry signed modules that load with Secure Boot on. After every kernel update, check `nvidia-smi` before you start work; the module is rebuilt for the new kernel by DKMS and needs its headers.

###### B.3 Base tools, `uv`, Python 3.12.13

```bash
sudo apt install -y git curl unzip pigz patch protobuf-compiler
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv python install 3.12.13
uv --version && uv python list | grep 3.12.13
```

###### B.4 The environment

```bash
mkdir -p ~/bcf && cd ~/bcf
uv venv --python 3.12.13 .venv && source .venv/bin/activate
# 1. PyTorch for Blackwell (sm_120 needs CUDA 12.8 or later)
uv pip install torch==2.10.0+cu128 torchaudio==2.10.0+cu128 torchvision==0.25.0+cu128 \
  --index-url https://download.pytorch.org/whl/cu128
# 2. the dependencies of vLLM 0.19.1 (the pinned wheel comes from the wheelhouse in step 3)
uv pip install vllm==0.19.1
# 3. the competition wheelhouse, with the two corrections the staff notebook makes
mkdir -p ~/bcf/wheelhouse && cd ~/bcf/wheelhouse
curl -L -o wheelhouse.zip https://www.kaggle.com/api/v1/datasets/download/metric/gemma-4-developer-agent-wheelhouse
unzip -q wheelhouse.zip
# 4. overlay the wheelhouse with the notebook's two corrections
cp ~/bcf/tools/install-wheelhouse.sh ~/bcf/ && bash ~/bcf/install-wheelhouse.sh ~/bcf/wheelhouse
python -c "import torch, vllm, swegemma; print(torch.__version__, torch.cuda.get_device_capability(), vllm.__version__)"
# expect: 2.10.0+cu128 (12, 0) 0.19.1
```

The fourth step is the script `tools/install-wheelhouse.sh` of this package:

It skips the cutlass wheels, restores the `+cu128` label in the file names, installs with `--no-deps --force-reinstall` through `uv pip` (or `pip` when `uv` is absent), and prints the versions it could import, with the expected values.

Why the corrections: Kaggle's upload strips the `+` from wheel file names, so `torch`-compatible builds look like a different version; the notebook restores it (`'cu128'` to `'+cu128'`). If a `+cu128` build of `torchaudio` or `torchvision` is missing from the PyTorch index, install all three without the suffix from PyPI instead (that is the CUDA 12.9 build, which also supports Blackwell); do not mix indexes.

###### B.5 The data package and the model

```bash
uv tool install kaggle            # or: pip install kaggle
mkdir -p ~/.kaggle && chmod 700 ~/.kaggle
# put your token file (from kaggle.com/settings, "Create New Token") at ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
mkdir -p ~/bcf/data && cd ~/bcf/data
kaggle competitions download -c gemma-4-developer-agent      # 21.9 GB; the rules must be accepted first
unzip -q gemma-4-developer-agent.zip -d ~/bcf/data
ls ~/bcf/data                      # tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission
```

For the weights, either download from the Kaggle model page (`google/gemma-4`, variant `gemma-4-31b-it-qat-w4a16-ct`, version 2) in the browser, or from Hugging Face:

```bash
uv pip install "huggingface_hub[cli]"
mkdir -p ~/bcf/models
huggingface-cli download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
huggingface-cli download google/gemma-4-E4B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct   # bonus track
```

The repository names on Hugging Face use capital letters (`31B`, `E4B`); the competition alias is lower-case. The folder name you choose is yours; what matters is the `--served-model-name` in section 5.

###### B.6 Docker for the scorer-like sandbox (optional, about 20 minutes)

```bash
# Docker Engine from the Ubuntu 24.04 ("noble") repository: Zorin's version id is 18, for which no repository exists
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"          # log out and in afterwards
# NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --gpus all ubuntu nvidia-smi                   # expect the 5090
# the sandbox image, from the Dockerfile the competition ships (needs the network for its pip step)
cd ~/bcf/data && docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker
docker run --rm swebench-sandbox:latest python3 --version      # 3.13.x: the interpreter the scorer's sandbox runs
```

Docker's documentation notes that derivative distributions such as Linux Mint are not officially supported; the `noble` repository works on Zorin 18.1 (not run here).

###### B.7 The brain

```bash
mkdir -p ~/bcf/brain && cp -r <this package>/bcf-brain-patched/. ~/bcf/brain/
cp -r <this package>/tools/. ~/bcf/tools/ && mkdir -p ~/bcf/results ~/bcf/submit
cd ~/bcf/brain && python build.py && python -m unittest tests.test_bcf      # about 90 seconds
```

---

##### 4. Track A: Windows 11 Pro with WSL2

vLLM does not support Windows natively ("To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution", vLLM 0.19.1 installation page). Everything that touches the model runs inside WSL2. Building and validating the brain runs on Windows itself (that is how this package was validated).

###### A.1 Windows side (PowerShell as administrator)

```powershell
wsl --install -d Ubuntu-24.04          # enables the required features and installs Ubuntu 24.04
# restart the machine, then create your Linux user name and password
wsl --update                            # the fix for "nvidia-smi works but CUDA is unavailable" on 50-series cards
wsl --version
nvidia-smi                              # on Windows: RTX 5090, driver 570.65 or newer
```

Create `C:\Users\<you>\.wslconfig` (not run here; values chosen for a 64 GB, 32-thread machine):

```ini
[wsl2]
memory=40GB
processors=24
swap=16GB
localhostForwarding=true
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
```

then `wsl --shutdown`. The defaults you are overriding: 50% of the memory for the VM and all logical processors (`.wslconfig` documentation). `autoMemoryReclaim` is an experimental setting with the values `disabled`, `gradual` and `dropCache`.

###### A.2 Inside Ubuntu (the `wsl` shell)

```bash
/usr/lib/wsl/lib/nvidia-smi               # WSL's own nvidia-smi: a limited feature set is normal
sudo apt update && sudo apt install -y git curl unzip pigz patch protobuf-compiler build-essential
printf '[boot]\nsystemd=true\n' | sudo tee /etc/wsl.conf      # needed only for Docker Engine inside the distro
```

then, from PowerShell, `wsl --shutdown` and open the shell again; verify with `systemctl list-unit-files --type=service`. Continue with **B.3 to B.7** exactly as on Zorin, with two differences:

- **Never install an NVIDIA driver inside the distribution.** The Windows driver is "stubbed inside WSL as libcuda.so"; "Do not install the cuda-drivers or nvidia-open packages" (CUDA on WSL User Guide). A CUDA toolkit is not needed for the pip environment; if you compile something, install `cuda-toolkit-<version>` from the standard Ubuntu repository (the WSL-Ubuntu repository is deprecated).
- **Downloads may land on Windows, work must not.** `D:\` is `/mnt/d` inside the distribution. Unpack the data package and the weights with `unzip ... -d ~/bcf/...` so that they end up on the Linux file system.

###### A.3 Docker on Windows: one of two

| Option | How | When |
| --- | --- | --- |
| Docker Desktop | `winget install Docker.DockerDesktop`; Settings, General, "Use the WSL 2 based engine" on. The GPU passthrough is built in: `docker run --rm --gpus all ubuntu nvidia-smi` | The simplest |
| Docker Engine inside the distribution | The commands of B.6, unchanged, after `systemd` is enabled | If you prefer one less layer; mutually exclusive with Docker Desktop's integration for that distribution |

###### A.4 Windows itself

The brain's loop runs natively: install Python 3.12 (or `uv`: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`) and run `python build.py`, `python -m unittest tests.test_bcf` and the validator from PowerShell in `brain\`. To reach the folder from WSL: `/mnt/d/...`; to reach WSL from Windows: `\\wsl$\Ubuntu-24.04\home\<user>\bcf`. Turn off Git's automatic line-ending conversion for the brain (`git config --global core.autocrlf false`): the build refuses carriage returns.

---

##### 5. Start the model server (both tracks)

Open a terminal, enter the environment, set the notebook's environment variables, and start vLLM with the notebook's settings for one GPU:

```bash
source ~/bcf/.venv/bin/activate
export HF_HOME=~/bcf/hf TRANSFORMERS_OFFLINE=1 TRANSFORMERS_NO_TF=1 TRANSFORMERS_NO_FLAX=1 \
       VLLM_NO_USAGE_STATS=1 VLLM_WORKER_MULTIPROC_METHOD=spawn VLLM_ENGINE_READY_TIMEOUT_S=1200 \
       VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
       NCCL_DEBUG=WARN LITELLM_LOCAL_MODEL_COST_MAP=True LITELLM_TELEMETRY=False OTEL_SDK_DISABLED=true
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  > ~/bcf/vllm-31b.log 2>&1 &
tail -f ~/bcf/vllm-31b.log        # wait for the line that says the server is started; the first start compiles kernels
```

| Setting | Value | Source |
| --- | --- | --- |
| `--served-model-name` | the bundle's `model:` line, exactly | The harness maps the declared model to `openai/<name>` on the server |
| `--max-model-len` | 32768 | Staff notebook, cell 8; the harness caps `max_output_tokens` and `thinking_budget` at the same number |
| `--dtype` | bfloat16 | Notebook |
| `--gpu-memory-utilization` | 0.90 | Notebook (the older README says 0.80) |
| `--enable-auto-tool-choice`, both parsers | `gemma4` | Notebook; vLLM's Gemma 4 guide |
| `--no-scheduler-reserve-full-isl` | the notebook sets it to `False`; vLLM's default is `True` | Notebook; vLLM 0.19.1 engine arguments |
| `--default-chat-template-kwargs` | thinking on | vLLM's Gemma 4 guide: "add the argument --default-chat-template-kwargs '{"enable_thinking": true}'" (not run here on 0.19.1: check `vllm serve --help` for the flag's exact name on this build) |
| No `--quantization` flag | the checkpoint's own config is read | Earlier guide of this project (2026-10-31) |
| No `--tensor-parallel-size` | one GPU; the notebook uses 4 when it sees 4 | Notebook |

For the bonus track, start the E4B server instead, with `--served-model-name gemma-4-e4b-it-qat-w4a16-ct`. For the 12B checkpoint only, add `--hf-overrides '{"architectures": ["Gemma4ForCausalLM"], "model_type": "gemma4"}'` (staff notebook).

Check it from a second terminal:

```bash
curl -s http://127.0.0.1:8000/v1/models | head -c 300        # lists "gemma-4-31b-it-qat-w4a16-ct"
```

Keep the server running for the whole working session: it is the slowest thing to recreate. Under WSL2, do not use `nvidia-smi` utilization as a health signal (unsupported query there); read `~/bcf/vllm-31b.log` or `curl -s http://127.0.0.1:8000/metrics`.

---

##### 6. First run: the smoke panel

```bash
source ~/bcf/.venv/bin/activate && cd ~/bcf
D=~/bcf/data
python tools/run_panel.py --tasks $D/tasks.jsonl --snapshots $D/snapshots \
  --bundle brain/dist/bcf-31b-flat --results results/smoke-01 \
  --panel tools/panel_smoke.txt --sandbox subprocess
```

`run_panel.py` does what the staff notebook does in its evaluation cell: it reads the four budgets from the bundle's `eval_config.yaml`, switches on compaction at 14,336 tokens, points the model registry at your server, and refuses to start if the server does not serve the bundle's model under the bundle's name. The plain `swegemma eval` command does neither: it ignores `eval_config.yaml` (it would give every task 60 minutes) and runs without compaction.

What to look at after five tasks (expect 5 to 15 minutes; not run here):

| Look at | Expect | If not |
| --- | --- | --- |
| The first printed line of `run_panel.py` | `model gemma-4-31b-it-qat-w4a16-ct ... eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s` | A different budget: the wrong bundle folder |
| `results/smoke-01/summary.json` | `total_tasks: 5` and a `resolved` count | `errors` above zero: open `task_results.jsonl`, column `error` |
| `results/smoke-01/logs/fastapi_14077.log` | The agent's calls: the installer, `plan`, `find`, `apply`, a test, `finalize`, `submit_patch` | `No module named` or `command not found` inside a call: the sandbox cannot find `python3` or `git` |
| `results/smoke-01/traces/trace_fastapi_14077.json` | Token usage and elapsed seconds per step | Absent: the trace was not written; read the log instead |
| `~/bcf/vllm-31b.log` | Requests arriving, no errors | Connection errors: the server restarted; read its last 50 lines |

For the Docker sandbox instead (slower per task, closer to the scorer): the same command with `--sandbox docker --image swebench-sandbox:latest`.

---

##### 7. Panel runs and comparisons

```bash
cd ~/bcf && source .venv/bin/activate
for r in 1 2 3; do
  python tools/run_panel.py --tasks data/tasks.jsonl --snapshots data/snapshots \
    --bundle brain/dist/bcf-31b-flat --results results/31b-flat-r$r --panel tools/panel30.txt --sandbox subprocess
done
python tools/run_report.py results/31b-flat-r1 results/31b-flat-r2 results/31b-flat-r3 \
  --labels <this package>/../2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_merged.jsonl --out results/31b-flat-report.md
```

Rules that make the comparison worth the time: the same panel in the same order for every bundle; three runs per bundle; one change at a time; the adopt condition written down before the run (Task 2, section C.5); the decision read from the paired table (Task 4, section 3.6). `--concurrency 3` runs three tasks at once on the 5090 and is fine for ranking runs once the smoke run is clean; use `--concurrency 1` for any run whose time you want to trust.

---

##### 8. The loop: change, build, validate

After any change under `brain/parts/` or `brain/src/prompts/`, or to the values in `brain/build.py`:

```bash
cd ~/bcf/brain
python assemble.py                               # helper from its parts; compiles before it writes
python build.py                                  # six bundles and zips in dist/
python -m unittest tests.test_bcf                # about 90 seconds: 36 pass, 1 skipped
python tools/setup_validate_venv.py              # once: the official harness packages (about 870 MB)
python tools/run_validator.py                    # official compiler 6 of 6, controls 15 of 15
sha256sum dist/bcf-31b-flat.zip                  # goes into the ledger
```

The per-task budgets live in two places that must agree: `EVAL` in `build.py` and `BUDGET_S` in `parts/_bcf_head.py`; the build stops when they disagree. Sampling parameters (thinking budget, temperature, output cap) live in `SAMPLING` in `build.py`.

---

##### 9. Prepare a submission

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Build and validate (section 8) | 6 of 6, 15 of 15, 36 tests |
| 2 | One smoke run with the model on the exact bundle | Clean: every task has a patch or a clear reason |
| 3 | One ranking-panel run, read with `run_report.py` | Projected hours for 120 tasks at or below 10.8 |
| 4 | Use `dist/<bundle>.zip` as built: `agent.yaml` is at the root of the archive | `unzip -l dist/bcf-31b-flat.zip` shows `agent.yaml` first |

---

##### 10. Submit to the competition: the main track

This is a code competition. Kaggle's documentation describes the flow: "all submissions must be made from inside a Kaggle Notebook. You cannot upload predictions directly", and "Initialize a Notebook with the competition dataset. Generate a submission file ... in /kaggle/working. Click 'Save Version', 'Save & Run All'. From the Notebook Viewer" submit to the competition. For this competition the file is `submission.zip` with `agent.yaml` at its root (Overview page); the staff Getting Started notebook writes it to `/kaggle/working/submission.zip`. The competition's scoring program then unpacks it, runs the agent on the hidden tasks and verifies the patches.

###### 10.1 Put the bundle where a notebook can read it

A notebook can only read its inputs, so the bundle travels as a private Kaggle Dataset (not run here; the dialog names are Kaggle's):

1. On kaggle.com: **Create**, **New Dataset**.
2. Upload the **contents** of `brain/dist/bcf-31b-flat/` (so that `agent.yaml` sits at the top level of the dataset, not inside a folder).
3. Title it after the bundle (for example `bcf-31b-flat-patched`), set **Private**, create.
4. Every time the bundle changes, add a new version of the same dataset with the same rule.

With the command line instead (the metadata file format is in `kaggle datasets create --help`):

```bash
mkdir -p ~/bcf/submit/ds && cp -r brain/dist/bcf-31b-flat/. ~/bcf/submit/ds/
cd ~/bcf/submit && kaggle datasets create -p ds        # later: kaggle datasets version -p ds -m "what changed"
```

###### 10.2 Create the submission notebook

1. **Code**, **New Notebook**. Add **Input**: the competition `Gemma 4 Developer Agent` (this attaches the data package; at scoring time the hidden test set replaces the training set) and your bundle dataset.
2. **Settings**: Internet **Off** (the L4 sessions must run without internet). Accelerator: none is enough for a notebook that only packages a file; choose **GPU L4 x4** only if the Submit option is not offered without an accelerator version.
3. Replace the content with one cell:

```python
import pathlib, shutil, zipfile

work = pathlib.Path('/kaggle/working')
roots = [p.parent for p in pathlib.Path('/kaggle/input').glob('*/agent.yaml')]
assert len(roots) == 1, f'expected one dataset with agent.yaml at its root, found {roots}'
agent = work / 'agent'
if agent.exists():
    shutil.rmtree(agent)
shutil.copytree(roots[0], agent)
archive = shutil.make_archive(str(work / 'submission'), 'zip', root_dir=agent)
with zipfile.ZipFile(archive) as z:
    infos = z.infolist()
print(archive, len(infos), 'files,', sum(i.file_size for i in infos), 'bytes; agent.yaml at root:',
      'agent.yaml' in z.namelist())
for i in infos:
    print(' ', i.filename, i.file_size)
```

4. **Save Version**, mode **Save & Run All (Commit)**. When the version has finished, open it from the Notebook Viewer and use **Submit to Competition**.
5. Keep the notebook and the dataset: a new bundle is a new dataset version and a new notebook version.

###### 10.3 After submitting

| When | Do |
| --- | --- |
| Right after | My Submissions shows the new entry as pending; one pending submission blocks the next |
| 26 to 29 hours later, typically | The score appears. Record it in the ledger (section 12) with the hours it took and the result size |
| The score is 0.00 | Read the result size: about 3,230 bytes means a backend failure (three teams, 2026-11-21 to 23; staff investigating). Resubmit the same file; do not change the bundle in response |
| The score is in the expected band | Nothing: a single value has a band of about 4 tasks (Task 4, section 6) |

Rules that apply to every submission: one per day; at most two final selections, by 2026-12-02 23:59 UTC; entry and team-merger deadline 2026-11-25 23:59 UTC.

---

##### 11. Submit to the bonus track: the small-model prize

The bonus prize ($10,000) goes to the highest-ranked submission on the private set whose base model is `gemma-4-e4b-it-qat-w4a16-ct` or `gemma-4-e2b-it-qat-w4a16-ct`, and the submission must be one of the team's two selected finals (Overview page, "Bonus Prize"). Nothing in the procedure changes except the bundle:

| Step | Main track | Bonus track |
| --- | --- | --- |
| Bundle | `dist/bcf-31b-flat` (or the relay twin) | `dist/bcf-e4b-flat` |
| Local server | the 31B weights, `--served-model-name gemma-4-31b-it-qat-w4a16-ct` | the E4B weights, `--served-model-name gemma-4-e4b-it-qat-w4a16-ct` |
| Dataset | the contents of the bundle folder | the contents of the E4B bundle folder |
| Notebook | the one-cell packaging notebook | the same notebook (it finds the dataset with `agent.yaml`) |
| Final selection | at most two, across both tracks | the E4B submission must be one of the two |

The E4B bundles already carry the settings the public measurements support for the small model: a thinking budget of 1,024 for the solver and 256 for the planner, planner temperature 0, an output cap of 8,192, short prompts, and a first edit by call 6. Do not attach a LoRA adapter to a first bonus submission. E4B is the variant to choose over E2B: a public report describes a loading failure of the E2B checkpoint on the pinned serving stack (thread 748287).

---

##### 12. The ledger

One row per attempt, kept by hand in any spreadsheet:

| Date (UTC) | Bundle | SHA-256 of the zip | Local panel: resolved in 3 runs | Projected mean s per task | Hours to score | Public score | Result size | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| example: 2026-11-25 08:10 | bcf-31b-flat (patched) | first 12 characters of `sha256sum` | 11, 10, 11 of 30 | 265 | 27 | 0.21 | 91,204 bytes | first attempt; answers whether skills run on the scorer |

---

##### 13. Acceptance table

Run these once after the install. Every pass condition can be checked without the model.

| Test | Command | Pass condition |
| --- | --- | --- |
| Driver | `nvidia-smi` (on Zorin; `/usr/lib/wsl/lib/nvidia-smi` under WSL2) | RTX 5090, driver 580 or newer on Linux (570.65 or newer on Windows) |
| Interpreter | `python --version` in the environment | `Python 3.12.13` |
| Torch | `python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_capability())"` | `True (12, 0)` |
| Stack | `bash tools/install-wheelhouse.sh` (it prints them) | vllm 0.19.1, transformers 5.13.1, swegemma 0.2.11 |
| Server | `curl -s http://127.0.0.1:8000/v1/models` | the bundle's model name |
| Data | `ls ~/bcf/data` | `tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission` |
| Brain | section 8 | 36 pass and 1 skipped; 6 of 6; 15 of 15 |
| Sandbox interpreter (Docker) | `docker run --rm swebench-sandbox:latest python3 --version` | `Python 3.13.x` |
| First smoke run | section 6 | five tasks, a result per task, no harness error |

---

##### 14. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No module named torch` after the wheelhouse install | The wheels were installed into another interpreter | Activate `~/bcf/.venv` first; `which python` must point into it |
| `CUDA error: no kernel image is available` | A PyTorch build without Blackwell kernels | Install torch from the cu128 index before everything else (section B.4) |
| `torch.cuda.is_available()` is `False` under WSL2 with `nvidia-smi` working | Stale WSL kernel | `wsl --update`, then `wsl --shutdown` |
| vLLM fails while starting under WSL2 and starts on Zorin | The GPU paravirtualisation limits pinned host memory | Keep `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`; lower `--gpu-memory-utilization`; or serve from Zorin |
| The model loads very slowly | Weights read through `/mnt/` | Move `~/bcf/models` and `HF_HOME` into the Linux file system |
| The server exits with a "head size not supported" message | Gemma 4's mixed head dimensions and the selected attention backend on vLLM 0.19.x | Read the backend line in the log; the earlier guide of this project set `VLLM_ATTENTION_BACKEND=TRITON_ATTN` for this case (2026-10-31) |
| `run_panel.py` exits with code 2 | No server, or the served name differs from the bundle's model | Start the server with `--served-model-name` equal to the `model:` line |
| Every task gets 60 minutes | The run went through `swegemma eval` instead of `run_panel.py` | Use `run_panel.py` |
| Tasks end at once with "Path traversal" or "No such file" | The sandbox cannot see `python3` or `git` | In Docker mode, rebuild the image from the shipped Dockerfile |
| Docker cannot see the GPU | Toolkit not configured, or two Dockers installed | `sudo nvidia-ctk runtime configure --runtime=docker`, restart Docker; keep one |
| `docker build` cannot find `imp.py` | Wrong build context | `docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker` (the context is the `docker` folder) |
| The VM keeps its memory after a run | Cache not reclaimed | `wsl --shutdown` between sessions |
| The notebook's Save & Run All fails on the one-cell notebook | More than one input has `agent.yaml` at its root, or the dataset was uploaded as a folder | Upload the contents of the bundle folder; keep only one such dataset attached |
| The submission scored 0.00 | Backend failure or a compile failure | Result size about 3,230 bytes: resubmit the same file. Normal size: run the validator on the exact zip |

---

##### 15. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent), version 3 | Ryan Holbrook (staff) | last run 2026-11-21; fetched 2026-11-24 | Environment variables, the wheelhouse install and its two corrections, vLLM settings, the `EvalConfig` values, the packaging cell, Python 3.12.13 |
| Competition [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), [Rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) | Kaggle | fetched 2026-11-24 | `submission.zip` with `agent.yaml` at the root, the 12-hour rule, the bonus terms, deadlines, one submission per day |
| [Kaggle competitions documentation](https://www.kaggle.com/docs/competitions) and [notebooks documentation](https://www.kaggle.com/docs/notebooks) | Kaggle | fetched 2026-11-24 | The code-competition flow, session limits, L4x4 quota |
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | fetched 2026-11-24 | The machine |
| [vLLM 0.19.1 installation](https://docs.vllm.ai/en/v0.19.1/getting_started/installation/gpu.html), [engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html), [Gemma 4 usage guide](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html) | vLLM project | fetched 2026-11-24 | No native Windows, CUDA builds, the serve flags |
| [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) | NVIDIA | v13.5, fetched 2026-11-24 | The driver rule, limitations |
| [`.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config), [install WSL](https://learn.microsoft.com/en-us/windows/wsl/install), [systemd](https://learn.microsoft.com/en-us/windows/wsl/systemd), [development environment guide](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) | Microsoft Learn | fetched 2026-11-24 | The Windows track |
| [Zorin OS technical details](https://zorin.com/os/details/), [Zorin OS 18.1 release post](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | Zorin | fetched 2026-11-24 | Version, base, kernel |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html), [uv](https://docs.astral.sh/uv/getting-started/installation/) | Docker, NVIDIA, Astral | fetched 2026-11-24 | The commands of sections B.3 and B.6 |
| `HARNESS_README.md`, `docker/Dockerfile.sandbox`, `swegemma` 0.2.11 source | Kaggle data package and wheelhouse v31 | read 2026-11-24 | The sandbox image, the CLI, the result files |
| [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004), [New Gemma 4 models](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | Kaggle staff and competitors | 2026-10-11 to 2026-11-23 | The 3,230-byte signature, the 12B override, the E2B report |
| RTX 5090 local-testing guide of 2026-10-31 (files 02, 03, 07, 08) | this project | 2026-10-31 | Driver floors, the TRITON attention fallback, Hugging Face repository names |

### F2. Live-run playbook

*Attached in full, as written on 2026-11-25. Its own title: “Live-run playbook: watch the BCF brain make its own decisions on the RTX 5090.”*

**Prepared:** 2026-11-25. **Machine it is written for:** PowerSpec G914 (RTX 5090, 32 GB) on Zorin OS 18. **Purpose:** run the real model through the real harness on `httpx_3672`, for both versions of the BCF brain and for the naive baseline, and read what the model actually did at every call.

##### 0. What this kit does and how far it was verified

| Question | Answer |
|---|---|
| Why a live run is needed | The package this kit belongs to ran the real harness with the model's choices written by hand. Only a live run shows what Gemma 4 31B decides on its own |
| What runs | `run_panel.py`, the staff Getting Started notebook's evaluation cell as a script. It compiles the bundle with the harness, drives the agent from your vLLM server, and grades the result with the harness's own verifier |
| What was verified, and where | On the Windows machine that built the package: `extract_decisions.py`, `compare_live.py` and `shadow_live.py` were run against a trace written in the harness's own format by the harness's own trace class, holding the scripted lane's calls. They produced the expected table, a 14-of-14 call alignment, and the expected verdicts. `run_live.py` was exercised in `--dry-run`; `preflight.py` was run and reported exactly the checks that cannot pass on a machine with no model server |
| What was not verified | No live run. The build machine has a 6 GB GTX 1060 and no Gemma 4 server. The first live run on the G914 is therefore a test of this kit as well as of the brain |
| Sampling | Both brains sample at temperature 0.2, so two runs of the same bundle differ. That is why the playbook asks for three repeats |

##### 1. Prerequisites

Complete sections 2 to 5 of the setup guide written for this machine on 2026-11-24 (`../2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/07_Setup_and_Run_Guide.md`, Track B, Zorin): the `~/bcf` folder, the Python 3.12.13 environments, the data package, the model weights and the vLLM server. Where that guide puts the harness into the same environment as the server, use two environments instead, as the test sets playbook of 2026-11-25 describes (`../2026-11-25_BCF_Test_Sets_Playbook/01_Playbook_Install_Zorin_OS_18.md`, steps 7, 8 and 12): the server in `~/bcf/.venv`, the harness in `~/bcf/.venv-harness`. Every command of this kit is run from `~/bcf/.venv-harness`. This kit adds two things.

| Item | What to do |
|---|---|
| Both brain versions | Copy the 2026-11-23 brain to `~/bcf/brain-v1123/` and keep the 2026-11-24 patched brain at `~/bcf/brain/`. Build each once with `python build.py` in its folder, so that `dist/bcf-31b-sequential` exists in both |
| LoRA on the model server | Start vLLM with three extra flags: `--enable-lora --max-loras 8 --max-lora-rank 128`. The official sample submission, which is the naive baseline, ships two LoRA adapters and declares them in its `agent.yaml`. The staff notebook starts its server with exactly these three settings (its cell 4, `enable_lora=True`, `max_loras=8`, `max_lora_rank=128`). The flags are harmless for the brains, which use no adapters, so use them always |

The full serve command of the setup guide, with the three flags added:

```bash
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --enable-lora --max-loras 8 --max-lora-rank 128
```

##### 2. Bring the kit over and point it at your folders

```bash
mkdir -p ~/bcf/live-run-kit && cd ~/bcf/live-run-kit     # then copy this folder's contents here
cp settings.example.json settings.json && nano settings.json
```

`settings.json` names five things: the task file, the snapshots folder, the two brain bundles, the sample submission and where captures go. Paths may start with `~`. The values in `settings.example.json` match the layout of the setup guide, so on a standard install only the captures folder needs no change at all.

##### 3. Preflight: prove it can work before spending GPU time

```bash
cd ~/bcf/live-run-kit && source ~/bcf/.venv-harness/bin/activate
python scripts/preflight.py --settings settings.json
```

| Result to expect | Check | If it fails |
|---|---|---|
| PASS | `model server answers /models` and lists `gemma-4-31b-it-qat-w4a16-ct` | vLLM is still loading. Read `~/bcf/vllm-31b.log` and wait for the line that says the server started |
| PASS | `model returns a tool call` | The server was started without `--enable-auto-tool-choice --tool-call-parser gemma4`. Restart it with both flags. Without them the agent answers in prose and never touches the repository |
| PASS | `harness packages in this interpreter` | You are outside the environment. Run `source ~/bcf/.venv-harness/bin/activate` |
| PASS | `bash` at `/bin/bash` | The harness's local sandbox needs it. On Windows, use the Docker sandbox or run on Linux |

The last check sends one real request with a tool definition to the model and prints the token usage of that request. It is the only check that uses the GPU.

##### 4. Kick off the live run

One command runs every combination, captures everything and resumes where it stopped if interrupted:

```bash
python scripts/run_live.py --settings settings.json --name live-01 \
  --tasks httpx_3672 --bundles v1123 v1124 naive --repeats 3
```

| Option | Meaning | Default in this playbook |
|---|---|---|
| `--tasks` | Instance ids from `tasks.jsonl`. The public one used throughout the package is `httpx_3672` | `httpx_3672` |
| `--bundles` | `v1123` (brain of 2026-11-23), `v1124` (patched brain of 2026-11-24), `naive` (the official sample submission) | all three |
| `--repeats` | Runs per combination. Each is a fresh sandbox and a fresh conversation | 3 |
| `--sandbox` | `subprocess` (what the staff notebook uses) or `docker` (slower, closer to the scorer) | `subprocess` |

Nine runs at most eight minutes each fit well under an hour and a half, usually much less. Leave the terminal open, or start the command inside `tmux` so that a closed window does not kill it. `run_live.py` skips any run whose folder already holds `task_results.jsonl`.

What `run_live.py` does for each run: it calls `run_panel.py` with the bundle's own budgets (8 minutes, 28 tool calls, 80 turns, 240 seconds per command for the brains), it then runs `extract_decisions.py`, and it runs `compare_live.py` against the scripted lane shipped under `reference/lanes/`.

##### 5. Read the decisions

Every run folder holds four files worth reading first.

| File under `captures/<name>/<bundle>/<task>/r<k>/` | What it holds |
|---|---|
| `decisions.md` | One row per tool call the model made: which agent, what role, the target, the second it was made, what came back, and flags such as `INSTALLED`, `APPLIED`, `NOT_APPLIED`, `TEST_FAIL`, `READY` |
| `decisions.json` | The same as data, plus the checkpoints |
| `live_vs_scripted.md` | The live calls aligned with the hand-written lane, marked `same`, `live only` or `scripted only` |
| `traces/trace_httpx_3672.json`, `logs/httpx_3672.log` | What the harness itself recorded: every event with token usage, and the agent's console |

###### 5.1 The checkpoints, and what a healthy run looks like

| Checkpoint | Healthy value | Why it matters |
|---|---|---|
| `installer` | `INSTALLED` | `INSTALL_FAILED` means the skill script could not find the repository or the helper. Every later helper call then fails |
| `baton_relayed` | `yes, verbatim` | The planner's whole job is to echo the spec. A reworded or missing spec leaves the solver without targets, route or budget plan |
| `first_edit` | call 2 to 6, under 150 seconds | The solver prompt asks for a source edit by call 10 and before 150 seconds |
| `edit_refusals` | 0 or 1 | Each `NOT APPLIED` is a call spent. Several in a row on one file means the model is copying search text badly |
| `first_red_test` and `decision_at_first_red` | `kept the rename` | This is the decisive moment on this task. See section 6 |
| `finalize` | `RESULT: READY` | `NOT READY` means a syntax error is on disk; `NO SOURCE CHANGES` means nothing was edited |
| `container_b_resolved` | `True` | The harness's verdict on the submitted patch |

###### 5.2 The call skeleton the prompts ask for

| Agent | Tool call | Role | What the model is told to do |
|---|---:|---|---|
| Planner | 1 | `install` | Run the skill's installer once, with no argument |
| Planner | 2 | `plan` | One command that builds the spec from a six-line brief |
| Planner | text | none | Answer with the spec, nothing else. A text answer is not a tool call |
| Solver | 3 | `ctx` | Read about 60 lines around the first target |
| Solver | 4 to 10 | `apply` | Edit one file per call, following the route |
| Solver | 11 | `test` or `repro` | One related test file |
| Solver | 12 | `finalize` | Compile every changed file, remove scratch files |
| Solver | 13 | `submit_patch` | Submit once, confirm `patch_size` is greater than 0. Free: it is not charged |

The scripted lane used 13 tool calls, 12 of them charged. The budget allows 28.

##### 6. The decision to watch: the first red test

`httpx_3672` orders a rename. A correct fix turns the visible test file red, because the visible tests still call the old name. The harness replaces those tests with hidden ones when it grades. Neither the brain's solver prompt nor the sample submission's prompt states a rule for this situation. The live run answers a question the package could not: what the model does when the test it just ran turns red.

| `decision_at_first_red` | What the model did | Graded result, measured in the package |
|---|---|---|
| `kept the rename` | Continued to `finalize` and submitted | Resolved |
| `alias (old name re-added as assignment)` | Added `complete = reset` so the visible test passes | Resolved, at the cost of two more calls |
| `reverted (old def restored)` | Undid the rename | Not resolved: 5 of 24 graded tests fail |

If several repeats land on `reverted`, the brain has a gap that costs the task. The package's document `03_How_the_Brain_Improves_on_Naive.md`, section 5, gives the one-sentence rule that closes it.

##### 7. Compare with what the package measured

`live_vs_scripted.md` is the place to look for surprises. Read its alignment table in this order.

| Column | How to read it |
|---|---|
| `same` | The model made the call the prompts ask for, on the same target |
| `live only` | A call the scripted lane did not make. Extra `ctx`, `grep` or `status` calls are normal. An `edit` or `apply` after the first red test is the decision of section 6 |
| `scripted only` | A call the model skipped. A missing `finalize` is worth a look at the next row: the prompt allows a direct `submit_patch` |

Numbers that mean nothing on their own: the token totals are summed over trace entries, and one entry can carry the same usage as its neighbour. Use them to compare runs with each other, not as a cost figure.

##### 8. Shadow verdicts for the live trajectory (optional)

The live run reports one verdict, for the final patch. To learn at which call the live trajectory started holding a passing patch, re-execute its calls with the replay driver:

```bash
python scripts/shadow_live.py captures/live-01/v1123/httpx_3672/r1/decisions.json \
  --steps /tmp/live_steps.json --run --settings replay/settings.json \
  --bundle ~/bcf/brain-v1123/dist/bcf-31b-sequential
```

This needs the replay toolkit described in `replay/README.md`. It was exercised on Windows with the Git Bash stand-in for the sandbox. On Linux it needs the `"manager": "docker"` setting and the `swebench-sandbox:latest` image of the setup guide, section B.6. That Docker path is implemented but has not been run anywhere yet.

##### 9. Panel runs (after the single task looks healthy)

The single task is one roll of one task. For a number that means something, run the ranking panel three times per bundle with `run_panel.py` directly, as the setup guide's section 7 describes, and read the result with its `run_report.py`.

##### 10. Bring the results back into the package

Copy the whole `captures/<name>/` folder into `live-run-kit/captures/` of the package. Keep `manifest.json` and `SUMMARY.md` at its top: they record the bundle fingerprint (a hash of every file in the bundle), the sandbox and the server address for each run, which is what makes a capture interpretable later.

##### 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `run_panel.py` prints `no OpenAI-compatible server answered` | vLLM is down or on another port | `curl -s http://127.0.0.1:8000/v1/models`, or pass `--base-url` |
| `the bundle declares ... but the server serves ...` | The served name differs from the bundle's `model:` line | Restart vLLM with `--served-model-name` set to exactly that line |
| Every task ends with an empty patch and no tool calls | The model returned prose instead of tool calls | The server lacks `--enable-auto-tool-choice --tool-call-parser gemma4` |
| The naive runs fail with an adapter error | The server runs without LoRA | Add `--enable-lora --max-loras 8 --max-lora-rank 128` |
| `INSTALLED` never appears; helper calls print `No such file` | The skill script did not run | Read `logs/httpx_3672.log`. The noskill bundles exist for this case |
| `decisions.md` says `no trace at ...` | The trace was not written | Pass `--instance httpx_3672`, and read `logs/` instead |
| A run stops early with `Agent exceeded session timeout` | The 8-minute budget ended | Normal for a slow task. Compare `agent_elapsed_seconds` across repeats |

##### 12. Notes for a first week on Linux

| Habit from Windows | On Zorin | The mistake to avoid |
|---|---|---|
| Paths with backslashes | Forward slashes, and your folder is `/home/<you>` or `~` | Pasting a Windows path such as `C:\Users\...` into a command |
| `python` | `python3`, or `python` after `source ~/bcf/.venv-harness/bin/activate` | Installing into the system Python with `sudo pip` |
| Double-click to run | Run a script with its interpreter: `python scripts/preflight.py` | Expecting a copied file to be executable. Files copied from Windows lose that bit; `chmod +x file` restores it |
| Files edited in a Windows editor | Files must end lines with LF | A CRLF file makes bash fail with `$'\r': command not found`. Fix with `sed -i 's/\r$//' file` |
| Case does not matter | It does | `Tasks.jsonl` and `tasks.jsonl` are two files |
| A closed window keeps a job running | It does not | Start long runs inside `tmux`: `tmux new -s live`, run, then detach with Ctrl+B and D |
| Software from a website | `sudo apt install <name>` first | Adding repositories by hand when the package exists |
| Drive letters | Disks are folders: the Windows disk is `/mnt/c` | Working under `/mnt/c` for the model or the harness. It is many times slower than the Linux file system |

##### Sources

| Source | Used for |
|---|---|
| `run_panel.py`, the 2026-11-24 package's tool, unchanged | The evaluation settings: budgets from the bundle, compaction at 14,336 tokens, model registry |
| Staff Getting Started notebook, cell 4 (`input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md`, lines 236 to 275) | LoRA settings of the model server; tool and reasoning parsers |
| `swegemma/results.py`, `swegemma/harness/agent_runner.py`, `adk_eval_core/tracing/trace.py` in the harness | The files a run writes and the trace format that `extract_decisions.py` reads |
| `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/07_Setup_and_Run_Guide.md`, sections 2, 3, 5, 6, 7 | Folder layout, installation, the serve command, smoke panel |
| vLLM documentation, Tool Calling (https://docs.vllm.ai/en/latest/features/tool_calling.html) | `--enable-auto-tool-choice` and `--tool-call-parser` are both required for the model to emit tool calls |
| Bundle files `configs/plan_sampling.yaml` and `configs/solver_sampling.yaml` | Temperature 0.2, output and thinking budgets |

### F3. Zorin OS 18 setup: the RTX 5090 native-Linux rig

*Attached in full, as written on 2026-10-31. Its own title: “03 · Zorin OS 18 Setup — RTX 5090 Native-Linux Rig.”*

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware & capacity, `02` Windows 11 (the same rig’s other boot), `04` harness usage, `05`–`08`, `09` sources.*

Zorin OS 18 is an **Ubuntu 24.04 LTS** base (glibc 2.39) — everything Ubuntu-noble applies, with two Zorin-specific divergences called out below (Docker repo dist string; kernel-headers lag on the 6.17 kernel). Native Linux is the cleanest path for this rig: the subprocess sandbox, the docker backend, and vLLM all run first-class.

##### 0. What makes this easy

- `vllm-0.19.1-cp38-abi3-manylinux_2_31_x86_64.whl` (433,132,101 B, sha256 `c8dde3c9af20f00a644e64a50ebe43948f2921bab3ffd5407d634c15836cb181`) installs on any CPython ≥3.8 with glibc ≥2.31 — Zorin 18’s glibc 2.39 qualifies.
- Ubuntu 24.04’s **system python3 is 3.12** — no deadsnakes needed; pin the exact competition patch (3.12.13) with uv.
- vLLM 0.19.1 dependency set (pinned): `torch==2.10.0`, `torchaudio==2.10.0`, `torchvision==0.25.0`, `flashinfer-python==0.6.6`, `flashinfer-cubin==0.6.6`; `requires_python <3.14,>=3.10`.

##### 1. Driver (do this first)

sm_120 needs the Blackwell-capable driver line: **570+** minimum (570.26 Linux floor for CUDA 12.8), branch **580 recommended** — the newest branch apt-installable from NVIDIA’s own ubuntu2404 repo (`nvidia-driver-580` = 580.196.07 as of 2026-10-31; the 595.99.02 “latest production” and 615.x new-feature branches exist only as `.run` installers, which bypass apt/dkms management — avoid). Build prerequisites first:

```bash
sudo apt-get update && sudo apt-get install -y linux-headers-$(uname -r) build-essential dkms pciutils
```

Path A — Ubuntu-signed driver (secure-boot friendly, no MOK enrollment):

```bash
sudo ubuntu-drivers update && ubuntu-drivers devices
sudo ubuntu-drivers install --gpgpu nvidia:580
```

Path B — NVIDIA’s own CUDA repo (guarantees the version regardless of archive mirrors):

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb && sudo apt-get update
sudo apt-get install -y nvidia-driver-580
```

Reboot, then verify: `nvidia-smi` → RTX 5090, driver 580.x, CUDA 12.8+.

**CUDA toolkit: not needed** for the pip rig — the vLLM wheel ships precompiled kernels and torch cu128 wheels bundle their own CUDA runtime; `cuda-toolkit-13-4` (repo max 13.4.3) only if you compile from source.

##### 2. Python env + the exact competition stack

```bash
sudo apt-get install -y python3.12 python3.12-venv python3.12-dev
python3.12 -m venv ~/rig-venv && source ~/rig-venv/bin/activate && pip install --upgrade pip
curl -LsSf https://astral.sh/uv/install.sh | sh
# exact competition pin (748287: verified combo = Wheelhouse V31 + Python 3.12.13):
uv python install 3.12.13 && uv venv --python 3.12.13 ~/rig-venv && source ~/rig-venv/bin/activate
# ORDER MATTERS: torch from the cu128 index FIRST (sm_120 guarantee), then vLLM:
pip install torch==2.10.0+cu128 --index-url https://download.pytorch.org/whl/cu128
pip install vllm==0.19.1
python -c "import torch, vllm; print(torch.__version__, vllm.__version__, torch.cuda.get_device_capability())"
# expect: 2.10.0+cu128 0.19.1 (12, 0)
```

Why the order: vLLM pins `torch==2.10.0` but resolving it from PyPI may fetch a variant without sm_120 kernels; pre-installing `2.10.0+cu128` from the cu128 index guarantees Blackwell. **Kaggle parity:** prefer the wheelhouse’s 41 wheels (incl. the *patched* vLLM 0.19.1) over PyPI when you have them — `04` §1 for the cutlass-skip + `cu128→+cu128` install dance.

Weights: `export HF_HOME=$HOME/hf`, HF token, then the smoke test:

```bash
vllm serve google/gemma-4-12B-it-qat-w4a16-ct --max-model-len 8192 &
curl http://localhost:8000/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-12B-it-qat-w4a16-ct","messages":[{"role":"user","content":"say ok"}]}'
```

(No `--quantization` flag — compressed-tensors auto-detects.)

##### 3. Docker (for the docker-backend sandbox)

**Zorin divergence #1:** docker.com’s documented command interpolates `$(. /etc/os-release && echo $VERSION_ID)` — Zorin’s `VERSION_ID` is **18**, and `dists/18/` does not exist. **Hardcode `noble`**:

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER   # log out/in
```

NVIDIA Container Toolkit (dist-agnostic repo — no Zorin substitution):

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi   # expect the 5090
```

Then build the harness images (`04` §7) and run `swegemma eval --sandbox docker` for full Phase-2 parity, or stay on `--sandbox subprocess` (no Docker at all) — both are first-class on this OS.

##### 4. swegemma + data package + acceptance test

```bash
source ~/rig-venv/bin/activate
# swegemma/adk-* from the wheelhouse (04 §1) or PyPI when published:
pip install --no-deps --force-reinstall /path/to/wheelhouse/*.whl   # (cutlass-skip + rename dance per 04 §1)
mkdir -p ~/rig && cd ~/rig && unzip /path/to/gemma-4-developer-agent.zip
# acceptance: gold patches pass ~127/129 in YOUR sandbox before any agent run (05 §1)
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir sample_submission --results-dir results/gold_control \
  --sandbox subprocess --skip-agent-patch --max-time-minutes 10
```

Note the sandbox Python divergence is by design: subprocess path = your 3.12.13; docker image = 3.13 — the scorer’s side is unknown, so parity-seekers run both (`08` T-04.4).

##### 5. Dual-boot data sharing with Windows (NTFS)

If the 21.9 GB data package / weights live on an NTFS partition shared with the Windows boot:

- **Disable Windows fast startup** (`powercfg /h off`) or Linux mounts the volume read-only after each Windows shutdown (dirty bit); `chkdsk /f` if already dirty.
- Mount with the **in-kernel `ntfs3`** driver — never ntfs-3g/FUSE — safetensors `mmap` and sequential loads work through the normal page-cache path on in-kernel filesystems, and are drastically slower over FUSE:

```bash
lsblk -f   # get the UUID
echo 'UUID=YOUR-NTFS-UUID /mnt/models ntfs3 defaults,big_writes,uid=1000,gid=1000,umask=022,nofail 0 0' | sudo tee -a /etc/fstab
sudo mount -a
```

Best performance remains **ext4 model dirs** + a smaller ntfs3 exchange partition; extract snapshots to ext4 before eval runs.

##### 6. Zorin/Linux pitfalls

| # | Pitfall | Rule |
|---|---|---|
| Z-1 | torch resolved from PyPI | Pre-install `torch==2.10.0+cu128` from the cu128 index **before** `vllm==0.19.1` |
| Z-2 | “Fixing” install errors by changing Python minor | Wheel is cp38-abi3, `>=3.10,<3.14` — 3.12 **and** 3.13 both work; 3.14 doesn’t |
| Z-3 | docker repo with interpolated VERSION_ID | Hardcode `noble` (Zorin VERSION_ID=18 404s) |
| Z-4 | `.run` NVIDIA installer | Secure boot breaks module load without MOK enrollment; apt paths ship signed modules; never mix `.run` + apt/dkms |
| Z-5 | Kernel update → nvidia-smi fails at next boot | DKMS rebuild needs `linux-headers-$(uname -r)` for the exact new kernel — install headers with every kernel update (Zorin 18.1 runs 6.17; **Zorin divergence #2**: header availability for each 6.17 revision should be checked on-metal) |
| Z-6 | vLLM version drift | Pin `vllm==0.19.1` exactly (or the wheelhouse build) — scheduling behavior differs across versions vs the competition image |
| Z-7 | Flatpak NVIDIA runtime noise | `org.freedesktop.Platform.GL.nvidia` is Flatpak-managed, auto-matches the driver, irrelevant to headless vLLM — don’t apt-remove it |
| Z-8 | Wayland/X11 worries | Irrelevant for headless serving — only kernel driver + CUDA userland matter |

**Minimal cost path:** driver → venv (3.12.13 + torch cu128 + vllm 0.19.1) → wheelhouse wheels → unzip data → subprocess-mode `swegemma eval`. Docker only if you want container parity.

---

*Sources: pypi.org/pypi/vllm/0.19.1/json (wheel sha256 + pins, fetched 2026-10-31); download.pytorch.org/whl/cu128/torch/ (torch-2.10.0+cu128 cp312 manylinux verified); download.nvidia.com XFree86 latest.txt (595.99.02, 2026-10-21) + CUDA ubuntu2404 Packages.gz (driver 580.196.07, toolkit ≤13.4.3); docs.docker.com/engine/install/ubuntu; NVIDIA container-toolkit install guide; docs.kernel.org/filesystems/ntfs3.html; Zorin blog (18.0 2025-10-14, 18.1 2026-04-15 kernel 6.17); intel 748287. Full list in `09-sources.md`.*

### F4. Validation results and submission playbook

*Attached in full, as written on 2026-11-24. Its own title: “Validation results and submission playbook.”*

**Prepared:** 2026-11-24. **Scope:** what was tested on the BCF brain code, with what result, and how to reproduce it and carry it to a submission. Every figure in this document was read from the result files produced by the test runs; nothing was typed from memory.

---

##### 0. Summary

| Check | Result |
|---|---|
| Helper tests | 37 tests: 36 pass in the standard run, and the optional real-snapshot test passes on two real checkouts |
| Editor fidelity | All 129 published fixes applied through the helper's editor on the real snapshots: 129 of 129 byte-identical to `git apply` |
| Localizer | Gold-touched file in the top 9 for 96 of 129 tasks on real repositories |
| Bundles | 6 of 6 compile with the official harness compiler |
| Validator | 15 of 15 deliberately broken bundles rejected |
| Model runs | None. The helper was tested without Gemma 4; how the model uses it is unmeasured |

---

##### 1. Environment

| Item | Value |
|---|---|
| Machine | Windows 11, Python 3.12.10 for the tests and the build |
| Harness packages | `adk-submission` 0.2.13, `adk-eval-core` 0.1.0, `swegemma` 0.2.11 and `google-adk` 1.36.1, taken from the public wheelhouse (dataset version 31, downloaded 2026-11-23) and installed into an isolated virtual environment; the compiler was run with the harness's own `build_submission_limits()` and with stand-in tools and model aliases |
| Data | The 129 published tasks and their repository snapshots, indexed from the 21.9 GB competition zip into a content-addressed store (98 MB of text files) |
| Not available | A Gemma 4 model endpoint, the 4xL4 scorer, and the scoring sandbox |

---

##### 2. Helper tests

`bcf-brain/tests/test_bcf.py`, standard library only. Each test creates a temporary Git repository with a small package, installs the helper into it and drives it through the command line exactly as the agent will.

| Test class | Tests | Covers |
| --- | ---: | --- |
| `T01Install` | 1 | first install prints the map and starts the clock; a second call reports a re-entry |
| `T02Read` | 5 | repository map; search by arguments and by heredoc; empty and no-hit queries; outline, line-window and grep; output cap |
| `T03Apply` | 11 | exact match; whitespace and indentation tolerance; several blocks all-or-nothing; ambiguous search refused; closest-lines hint; syntax error writes nothing; line-range replace, insert, delete; new file and whole-file put; truncated block ignored; protected paths refused; a missing heredoc never blocks |
| `T04Verify` | 3 | repro fails before the fix and passes after; a script that passes before any edit is flagged; timed-out script; test runner reports the true exit status and refuses a whole suite |
| `T05Hygiene` | 5 | check reverts test and configuration files; check reports a syntax error; finalize removes scratch files and keeps intended ones; finalize with no change; status, resume and note |
| `T06Spec` | 3 | plan builds and stores the baton, spec prints it with progress, installer re-entry; every route; spec without a plan |
| `T07Governor` | 3 | freeze refuses edits and names the next command; hard stop; urgent status before a first edit; every error path exits with status 0 |
| `T08Installer` | 4 | installer run from a folder that holds only the skill files; repository found by walking up; failure reported with exit 0; helper missing next to the installer |
| `T08RealSnapshot` | 1 | install and search on a real materialised checkout (optional, enabled with an environment variable) |
| `T09LineEndings` | 1 | an edit to a CRLF file keeps CRLF and produces a one-line diff |
| Total | 37 |  |

To run: `python -m unittest tests.test_bcf -v` from the `bcf-brain` folder. The real-snapshot test is enabled by setting `BCF_TEST_SNAPSHOT` to a repository checkout.

---

##### 3. Editor fidelity: replay of the published fixes

The editor is the part of the brain that must never corrupt a file, so it was tested against real upstream patches rather than only against hand-written cases. For each of the 129 tasks the repository snapshot was materialised, the helper installed, the published fix converted into search/replace blocks (three lines of context, as the version control tool produces them) and applied with `apply`; newly created files went through `put` and deleted files through `rm`. The result was then compared byte for byte with `git apply` of the same patch on a clean checkout. Where a search block was ambiguous, the context was widened to 6, 12 and 25 lines, and a file with repeated blocks was edited through the line-range form - the same recovery the solver prompt prescribes.

| Measure | Value |
| --- | --- |
| Tasks replayed | 129 |
| Gold files and hunks | 278 files, 695 hunks |
| Applied by the helper without error | 129 of 129 |
| Byte-identical to `git apply` | 129 of 129 |
| Files that needed search context wider than three lines | 4: `fastapi_14609` params.py (12); `fastapi_14371` params.py (12); `fastapi_14605` exceptions.py (12); `fastapi_14605` temp_pydantic_v1_params.py (6) |
| Files that needed the line-range form | 1: `fastapi_14609` fastapi/param_functions.py |
| Files skipped as non-text | 0 |

Two notes on reading the table. The dataset's patches carry no file header, so `git apply` empties a deleted file while the helper removes it; both were counted as agreement because the upstream commit deleted the file. The helper refuses an edit whose search text matches more than one place; that refusal is deliberate and is what kept four of the 278 files from applying on the first attempt.

---

##### 4. Localizer evaluation

The localizer was run against all 129 real snapshots through an in-memory store, with terms extracted mechanically from each problem statement (identifiers, quoted literals, paths and title words). This imitates a weak planner; a model-written term list should do better.

By repository, and by statement level:

| Repository | Tasks | Gold file in top 5 | Gold file in top 9 | Gold function in top 3 | Gold function in top 9 |
| --- | ---: | ---: | ---: | ---: | ---: |
| fastapi | 67 | 38/67 | 56/67 | 22/63 | 28/63 |
| rich | 48 | 15/48 | 27/48 | 14/45 | 16/45 |
| requests | 13 | 2/13 | 12/13 | 6/12 | 8/12 |
| httpx | 1 | 1/1 | 1/1 | 0/1 | 1/1 |
| All | 129 | 56/129 | 96/129 | 42/121 | 53/121 |

| Statement level | Kind | Tasks | Gold file in top 5 | Gold file in top 9 | Gold function in top 3 | Gold function in top 9 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| L1 | prescriptive | 12 | 9/12 | 11/12 | 4/12 | 5/12 |
| L2 | descriptive | 70 | 30/70 | 57/70 | 23/64 | 31/64 |
| L3 | title and link | 27 | 9/27 | 16/27 | 11/27 | 11/27 |
| L4 | title only | 20 | 8/20 | 12/20 | 4/18 | 6/18 |

How the localizer improved during the work:

| Version | Change | Gold file in top 5 | Gold file in top 9 |
| --- | --- | ---: | ---: |
| v1 | term counts, no rarity weighting | 47/129 | 80/129 |
| v2 | rarity weighting and direct path matching | 47/129 | 95/129 |
| v3 and final | plus a size penalty so focused functions outrank large classes; source files scanned first | 56/129 | 96/129 |

A search took median 0.39 s, maximum 1.02 s per repository in memory.

---

##### 5. Bundles under the official compiler

`bcf-brain/tools/validate_official.py` calls the harness's own `compile_submission()` with the harness's own limits, then renders every instruction with the framework's own templating code under two state shapes: the planner's state, which holds only the issue, and the solver's state, which also holds the baton. It then checks what the compiler does not: skill name and frontmatter, the four integer budgets, the per-task cap, tools with list arguments, file extensions, tab characters and byte-order marks.

| Bundle | Track and topology | Files | Bytes | Solver prompt (characters) | Planner prompt (bytes) | Helper (bytes) | Official compiler |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `bcf-31b-sequential` | 31B relay | 11 | 74,406 | 5,585 | 2488 | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-31b-flat` | 31B flat | 7 | 71,808 | 6,524 | - | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-31b-noskill` | 31B no-skill | 4 | 4,862 | 4,054 | - | - | PASS (0 failures, 1 warnings) |
| `bcf-e4b-sequential` | E4B relay | 11 | 70,288 | 2,799 | 1157 | 59,029 | PASS (0 failures, 0 warnings) |
| `bcf-e4b-flat` | E4B flat | 7 | 68,425 | 3,141 | - | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-e4b-noskill` | E4B no-skill | 4 | 2,806 | 1,998 | - | - | PASS (0 failures, 0 warnings) |

The validator's warning on four bundles is advisory: the solver instruction is longer than 2.6 KB.

###### 5.1 Negative controls

A validator is only as good as the defects it rejects, so fifteen broken copies of a good bundle were presented to it.

| Broken copy | Why it was rejected |
| --- | --- |
| `skill_name_with_underscore` | FAIL skill directory is lowercase kebab-case: bcf_spec |
| `root_has_model_key` | FAIL compile_submission raised SubmissionSchemaError: Submission schema validation failed: 1 validation error for Sandb |
| `root_has_instruction_key` | FAIL compile_submission raised SubmissionSchemaError: Submission schema validation failed: 1 validation error for Sandb |
| `unknown_tool` | FAIL compile_submission raised ToolNotFoundError: Tool 'web_search' not found in registry. Available tools: edit_file, |
| `graph_tool_list_argument` | FAIL no list-argument tools attached (parser-hang hazard): ['get_code_subgraph'] |
| `prompt_bare_brace_variable` | KeyError: 'Context variable not found: `filename`.' |
| `strict_bcf_spec_var_missing_state` | KeyError: 'Context variable not found: `bcf_spec`.' |
| `unknown_model` | FAIL compile_submission raised ModelNotFoundError: Model alias 'gemma-3-27b-it' not found in registry. Available models |
| `missing_include_file` | FAIL compile_submission raised SubmissionValidationError: !include file not found: <path> |
| `eval_null_budget` | FAIL eval_config.max_tool_calls is a positive integer (got None) |
| `eval_15_minute_cap` | FAIL max_time_minutes <= 8 (largest per-task cap with public evidence of finishing: got 15) |
| `eval_file_removed` | FAIL eval_config.yaml present (explicit budgets; unset = 60 min/task) |
| `disallowed_extension` | FAIL allowed extension: notes.txt.bak |
| `tab_in_prompt` | FAIL no tab characters: prompts\solver.md |
| `frontmatter_colon_unquoted` | FAIL SKILL.md frontmatter parses: bcf-spec (ScannerError: mapping values are not allowed here |

The control `strict_bcf_spec_var_missing_state` is the reason the solver instruction uses the optional form: with the strict `{bcf_spec}`, the first model call of every task would raise the error shown.

---

##### 6. Speed on real checkouts

Measured on materialised snapshots with a cold and a warm file cache.

| Checkout | Text files | Install (s) | Search, first run (s) | Search, second run (s) | Plan step (s) | Search output (characters) | Time cap reached |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| fastapi_15763 | 1322 | 0.70 | 1.38 | 1.11 | 1.08 | 1641 | no |
| fastapi_15763 | 1322 | 0.71 | 1.12 | 1.08 | 1.11 | 1813 | no |
| rich_4079 | 509 | 0.58 | 0.86 | 0.74 | 0.79 | 1456 | no |
| rich_4079 | 509 | 0.58 | 0.54 | 0.52 | 0.54 | 1837 | no |

The scorer has two virtual CPUs and the repository is extracted shortly before the task, so these times are indicative, not measurements of the scorer.

---

##### 7. Defects found and fixed during development

Recorded because each one would have reached the submission unnoticed without a specific check.

| Defect | How it was found | Fix |
|---|---|---|
| The editor's block parser never matched a block, so no edit applied | First test run | The block accumulator was flattened by an earlier edit; restored |
| Commands that read standard input hung when no heredoc was supplied | Tests timed out | Input is read on a thread with a timeout; the helper always exits |
| Test run times reported as about half the true value | The installer printed a wrong elapsed time | Clock started at the right moment |
| Messages contained absolute Windows paths | Test assertions | Repository-relative paths everywhere |
| An edit to a CRLF file converted the whole file to LF | Found while designing the replay | Line-ending style detected and preserved; covered by a test |
| Search stopped after 8 seconds on a cold disk and had not reached all source files | Real-snapshot test on a 1,322-file checkout | Source files are scanned first, with a longer cap |
| The replay harness counted "NOT APPLIED" as applied, which produced a false "129 of 129 applied" | Inspecting the four tasks whose result differed from `git apply` | Success is now matched at line start. With that correction three tasks (`fastapi_14371`, `fastapi_14605`, `fastapi_14609`) turned out to be refused by the editor, correctly, because their search text matched more than one place. The widening and line-range recovery routes were then added to the replay, as the solver prompt prescribes them, and the final result is 129 of 129 applied and identical |
| The brain never emitted two of its ten routes | Cross-reading the document against the code | Routes for schema and compatibility tasks added to the helper and to the solver prompt |
| An unquoted colon in a bundle description made the YAML unparsable | The official compiler | Description quoted; the bundle would have scored 0.00 |
| A helper source file was emptied by a failing patch script | The build stopped compiling | The helper is assembled from its parts with compile check, atomic replace and a backup |

---

##### 8. What was not validated

| Not validated | Why it matters | How to close it |
|---|---|---|
| Whether the planner makes the two calls and relays the baton verbatim | The relay depends on it | Run 30 tasks locally and count batons that match the stored baton |
| Whether the solver follows the route and calls `finalize` and `submit_patch` | Determines whether edits reach the grader | Inspect the per-task traces |
| Mean seconds per task | A run over 12 hours scores zero | Read it from the same local runs before the first submission |
| The sequential relay against the flat twin | The relay is the unproven part of the design | Paired panel runs (Document 02, Section 10.3, hypothesis H1) |
| Skill-script execution on the scorer | One team's skill-only bundle scored 0.00 | First submission of a skill-carrying bundle; the no-skill bundle is the fallback |
| The E4B bundles with the E4B model | All E4B settings come from other teams' measurements | Same protocol with the E4B model |

---

##### 9. Proposed evaluation panel

The leaderboard cannot rank bundles that differ by two tasks, so bundles have to be ranked locally first. The panel below holds the 30 tasks that an agent can address: specification gap none or minor, difficulty 3 or less, and gradable in the public sandbox. They were drawn evenly from the 52 tasks that satisfy these rules, in proportion to each repository's share (fastapi 16, rich 11, requests 3).

| Task | Repo | Category | Sub-category | Route | Difficulty | Spec gap | Statement level | What it asks |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `fastapi_11194` | fastapi | C1 | VAL | P2 | 2 | none | L2 | Use each field's own File info when extracting multipart bodies |
| `fastapi_13537` | fastapi | C1 | VAL | P1 | 2 | none | L2 | Track visited form fields so empty strings fall back to None defaults |
| `fastapi_14297` | fastapi | C1 | VAL | P1 | 1 | none | L1 | Unwrap Optional unions in serialize_sequence_value so optional file lists |
| `fastapi_14356` | fastapi | C1 | VAL | P2 | 2 | minor | L1 | Keep all repeated values for extra Query and Header model fields |
| `fastapi_14430` | fastapi | C1 | TYP | P3 | 3 | minor | L2 | Optional sequences declared with PEP 604 pipe union crash serialization |
| `fastapi_14463` | fastapi | C1 | OAS | P2 | 2 | none | L1 | Stop duplicate anyOf refs when app-level Union responses also declare cont |
| `fastapi_14616` | fastapi | C1 | VAL | P2 | 2 | none | L1 | Fix Json-wrapped list Form/Query params being misread as multi-value |
| `fastapi_14873` | fastapi | C1 | RTG | P2 | 2 | minor | L2 | Fix on_startup handlers wiped by Starlette Router init order |
| `fastapi_15763` | fastapi | C1 | RTG | P3 | 3 | minor | L2 | Empty leaf path with nested prefix must not raise |
| `fastapi_9425` | fastapi | C1 | TYP | P1 | 2 | none | L4 | Treat stringified 'None' return annotation as None so 204 works |
| `fastapi_15785` | fastapi | C2 | RTG | P4 | 3 | minor | L2 | Add public iter_route_contexts for code that walked router.routes |
| `fastapi_9753` | fastapi | C2 | DI | P4 | 3 | minor | L2 | Make functools.partial dependables work for every callable kind |
| `fastapi_14791` | fastapi | C4 | OAS | P5 | 2 | minor | L2 | Add input and ctx fields to OpenAPI ValidationError schema |
| `fastapi_15588` | fastapi | C4 | SER | P1 | 2 | minor | L2 | Reject multi-line SSE event and id fields |
| `fastapi_14492` | fastapi | C5 | EXM | P8 | 1 | none | L4 | Correct docs metadata example license identifier to Apache-2.0 |
| `fastapi_14077` | fastapi | C6 | CMP | P1 | 2 | none | L2 | Use literal 422 instead of deprecated Starlette status constant |
| `requests_6629` | requests | C1 | OBJ | P1 | 2 | none | L2 | Make JSONDecodeError picklable by delegating __reduce__ to the JSON parent |
| `requests_7309` | requests | C1 | NET | P1 | 1 | minor | L2 | Skip Content-Type parameters lacking equals instead of emitting True senti |
| `requests_7427` | requests | C1 | NET | P2 | 3 | minor | L2 | Match no_proxy entries only at domain boundaries, like CPython bpo-39057 |
| `rich_2725` | rich | C1 | REN | P2 | 2 | none | L2 | Render mid box glyphs mid-table and footer glyphs in the footer |
| `rich_3006` | rich | C1 | DBG | P3 | 2 | minor | L2 | Custom __eq__ default equal to Parameter.empty breaks auto rich repr |
| `rich_3067` | rich | C1 | PAR | P3 | 2 | minor | L2 | URL highlighting stops at tilde; add ~ to the url pattern |
| `rich_3278` | rich | C1 | PAR | P2 | 2 | minor | L2 | Strip private-use ANSI escape sequences (ESC 0-?) from decoded text |
| `rich_3454` | rich | C1 | PAR | P1 | 1 | none | L2 | Add @ to url highlighter pattern so @-URLs highlight fully |
| `rich_3506` | rich | C1 | WID | P3 | 2 | minor | L3 | fix Segment._split_cells cutting at wrong cell positions |
| `rich_3521` | rich | C1 | WID | P3 | 3 | minor | L3 | rewrite Segment.split_cells to split exactly on cell boundaries |
| `rich_3718` | rich | C1 | REN | P2 | 3 | minor | L2 | give Panel title and subtitle the panel background style |
| `rich_3882` | rich | C1 | CON | P1 | 1 | minor | L2 | Prompt validation errors print raw markup when console markup is disabled |
| `rich_3905` | rich | C1 | REN | P1 | 1 | none | L2 | Disabled Progress should not print a blank line on non-interactive console |
| `rich_3052` | rich | C2 | CON | P4 | 3 | minor | L2 | Add case_sensitive option to Prompt.ask for case-insensitive choice matchi |

Protocol: three runs per bundle on the same tasks in the same order; a change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses across the paired runs; record, per task, the resolved flag, the time of the first edit, the calls used, the refused edits, the tests run, the phase at submission, the nudges and the compactions; and record the mean seconds per task, which multiplied by the task count must stay below about 10 hours.

---

##### 10. Reproduction

| Step | Command (from the `bcf-brain` folder unless stated) |
|---|---|
| Assemble the helper from its parts | not needed for use: `src/bcf.py` is the assembled file |
| Build the six bundles and zips | `python build.py` |
| Helper tests | `python -m unittest tests.test_bcf -v` |
| Compile with the official harness | `python tools/setup_validate_venv.py` once, then `python tools/run_validator.py` |
| Check the Markdown tables | `python tools/qc_tables.py <folder>` |

`tools/setup_validate_venv.py` downloads the public wheelhouse (about 870 MB), creates a virtual environment next to the `bcf-brain` folder and installs the four pinned packages. `tools/run_validator.py` validates all six bundles and then runs the negative controls.

The analysis pipeline of Document 01 (feature extraction, snapshot indexing, analysis packs, merge of the coded records, rendering) is in the `analysis/` folder of this deliverable, with the coded records in `data/`.

---

##### 11. Submission checklist

| Step | Action | Pass condition |
|---|---|---|
| 1 | `python build.py` | six bundles and six zips, no hygiene error |
| 2 | `python -m unittest tests.test_bcf` | 36 pass, 1 skipped |
| 3 | `python tools/run_validator.py` | 6 of 6 pass, 15 of 15 controls rejected |
| 4 | Local panel run of the bundle to submit | mean resolved known; mean seconds per task at or below about 270 |
| 5 | Inspect three traces by hand | the planner made two calls and relayed the baton; the solver edited through the helper; `finalize` ran before `submit_patch` |
| 6 | Zip the folder contents at the archive root | the archive holds `agent.yaml` at the top level |
| 7 | Submit early in the day | one pending submission at a time; 26-29 hours per attempt |
| 8 | After scoring, read the result size from the submissions page | a normal result is tens of kilobytes; about 3,230 bytes means a backend failure, so resubmit the same file |
| 9 | Choose the two finals by local mean | the private leaderboard is one run |

### F5. Scoring and evaluating local runs

*Attached in full, as written on 2026-11-24. Its own title: “Task 4 - Scoring and evaluating local runs: how to read them, how they relate to the official score, and how to turn them into tuning decisions.”*

**Prepared:** 2026-11-24. **Applies to:** result folders written by `swegemma eval` (wheelhouse v31) for any of the six BCF bundles. **Companion tool:** `tools/run_report.py` in this package turns one or more result folders into the tables described in section 3 (standard library only; exercised on a synthetic fixture because no model run exists yet).

---

##### 1. What a run writes

| File | Written by | Contains | Use it for |
| --- | --- | --- | --- |
| `summary.json` | after every task | `total_tasks`, `resolved`, `resolution_rate`, `by_repo`, `errors` | A first glance only: it has no timing and no outcome classes |
| `task_results.jsonl` | after every task | one line per task: `instance_id`, `repo`, `resolved`, `agent_patch_size`, `test_exit_code`, `duration_seconds`, `error`, `tool_calls`, `total_llm_calls`, `task_index` | The score, the outcome class, the call counts |
| `traces/trace_<id>.json` | at the end of a task | the ATIF v1.7 trajectory: every model step with its tool calls and arguments, every tool response, token usage, `final_metrics` with `total_prompt_tokens` and `total_completion_tokens` | Time, tokens, process counters, compliance |
| `logs/<id>.log` | during the task | the readable transcript of the agent session | Reading one task by hand |
| `test_outputs/<id>.log` | after verification | the stdout and stderr of the pytest run in Container B | Why a patch failed: assertion, missing dependency, skip |
| `patches/<id>.patch` | after verification | the exact unified diff extracted from Container A | What the agent really changed |

One fact to keep in mind before any number is read: **`duration_seconds` is not the agent's time.** The harness starts its clock before Container A is set up and stops it after Container B has verified the patch (`evaluate.py`, `start_time` at the top of `evaluate_task`; `verify_task` returns `time.perf_counter() - start_time`). The agent's own time is the last `elapsed_s` in the trace. A mean of 300 in `duration_seconds` may contain 60 seconds of setup and 60 of verification. The agent's own time is the last `elapsed_s` in the trace: the trace starts when Container A starts, so it includes that container's setup and excludes verification. The budgeted agent time proper is still smaller (the harness starts it after setup), so the trace figure is an upper bound for it and the right one for the 12-hour arithmetic, which includes setup.

---

##### 2. Before the numbers: three panels and four exclusions

| Panel | Size | Purpose | Cost on the 5090 |
| --- | ---: | --- | --- |
| Smoke | 3 to 5 tasks, one of each repository | "Does the bundle run end to end, and what does one call cost?" | 5 to 15 minutes |
| Speed | 10 tasks chosen for long trajectories | "Does the bundle stay inside the time and call budgets?" | 20 to 50 minutes |
| Ranking | the 30-task panel of the validation report, or its 52-task superset | "Is bundle A better than bundle B?" | 1.5 to 3 hours per run |

Exclusions, applied before any comparison:

1. **Ungradable here (29 tasks, 22.5%):** 21 FastAPI tasks whose tests import `inline_snapshot` or `dirty_equals` and 8 requests tasks that need the `httpbin` fixture. A correct patch fails them in the public sandbox and in the staff notebook. They add noise without information.
2. **Unsatisfiable in one interpreter (2 tasks):** `fastapi_14186` and `rich_3486`, whose required tests are skipped under mutually exclusive conditions (discussion 754586).
3. **Network-dependent (the same eight requests tasks):** under `network_mode='none'` they fail with `OSError: [Errno 101] Network is unreachable` (discussion 754586). They are the eight tasks of exclusion 1, seen from the scorer's side: 31 tasks are excluded in total, not 39.
4. **Severe and hard (31 tasks):** severe specification gap with difficulty 4 or 5. Keep them in a separate "long tail" count; never in the ranking panel.

Run the panel **in the same order every time**, repeat **three times per bundle**, and keep the results folder named by the bundle's SHA-256 (`dist/MANIFEST.json` has it) so that a rerun cannot be mistaken for a new variant.

---

##### 3. The report, table by table

Run `python tools/run_report.py results/run1 results/run2 --labels data/rca_merged.jsonl --out report.md` (the labels file is `rca_merged.jsonl` of the RCA package). Seven tables come out. Each has a question it answers and a pattern that should make you act.

###### 3.1 Score and time

| Column | Question | Act when |
| --- | --- | --- |
| Resolved and Rate | How many tasks passed? | Only compared with another run on the same panel |
| Errors and Empty patches | How many tasks produced nothing? | More than one empty patch in thirty: read those traces first; an empty tree scores zero |
| Agent s: mean, p50, p90, max | How long did the agent take, from the trace? | A p90 near the cap means the governor is not ending tasks early enough |
| Projected s: mean, p90 | What would the agent have taken at the scorer's decode rate? | Mean above 300: the 12-hour risk is real (360 is the ceiling at 120 tasks) |
| Projected hours for the run | Mean projected time times the task count | Above 10.8 hours: lower the per-task cap before submitting |
| Tasks over budget | How many tasks would exceed the mean budget? | Each one is a task that probably ends without `submit_patch` |

The projection replaces the model's decode time with `completion tokens / rate` and keeps the tool time as measured. Its two parameters are the decode rate (13 to 25 tokens per second published; the tool defaults to 20) and the time to first token (default 1 second per call). It is an estimate, and it is deliberately conservative in the direction that matters: a projected mean that fits is a better sign than a local mean that fits.

###### 3.2 Tokens per task

| Column | Act when |
| --- | --- |
| Completion tokens: mean and p90 | The mean is above about 9,000 (28 calls at the affordable 219 to 322 tokens): the model is thinking or writing too much per call |
| Output tokens per call: mean | Above 400: the same conclusion seen per call |
| max in one call | Near 8,192: one call is consuming the output cap; expect a MAX_TOKENS nudge and a lost edit |
| Prompt tokens: mean | Growing with the call count: context is not being kept small; compaction will follow |

###### 3.3 Process counters

| Column | Act when |
| --- | --- |
| Tool calls per task: p90 | At or near 28: tasks run out of calls before they run out of time |
| Refused helper edits | More than about one per two tasks: the search blocks are wrong (stale text, non-unique match); read two refusals |
| Tool errors | Any: each one is a wasted call; read the first |
| Nudges | Any: a turn ended without `submit_patch`; in the relay, each nudge also re-runs the planner |
| Compactions | Any in the first 15 calls: the context grows too fast |
| Tasks with `finalize` | Should equal the number of tasks with a patch; otherwise the solver is submitting without the hygiene step |
| Tasks with `submit_patch` | Should equal the number of tasks with a non-empty patch |
| Patches touching protected paths | Must be zero; the harness discards those files, and the helper is supposed to refuse them |
| List-argument calls | Must be zero: a list argument is the parser-hang hazard of vLLM 0.19.1 |

###### 3.4 Outcome of every task

Every unresolved task gets exactly one class, in this order:

| Class | Meaning | First thing to read |
| --- | --- | --- |
| `no edit: calls exhausted` | The budget of tool calls ended with nothing on disk | The call list: where did the calls go? |
| `no edit: time` | The time ended with nothing on disk | The first-call time and the tokens per call |
| `no edit` | Neither budget ended and still no edit | The last three tool results |
| `patch did not apply` | The diff could not be applied in Container B (four passes) | `patches/<id>.patch`: binary content, a renamed file, a mode change |
| `no JUnit report` | Pytest exited 0 but wrote no report | `test_outputs/<id>.log`: an early `os._exit` |
| `required test failed or skipped` | A required node failed or was skipped | The assertion in `test_outputs/<id>.log` |
| `ungradable here` | A dependency or a network fixture is missing | Nothing: exclude the task |
| `pytest error (exit 2 to 5)` | Interrupted, internal error, usage error, or nothing collected | The collection error in the log |
| `harness error` | An exception in the evaluation itself | `error` in `task_results.jsonl` |
| `edit but time ran out before submit` | An edit exists and no `submit_patch` was called | Why the turn did not end |

###### 3.5 Breakdowns

Resolved counts by category, domain, route, specification gap and difficulty, taken from the RCA records. The useful reading is a row where one bundle is clearly ahead or behind: a route with zero resolved in three runs is a route whose procedure is wrong, not a hard route.

###### 3.6 Paired comparison

For two runs on the same tasks: both, A only, B only, neither, the difference and the exact sign-test p-value. **This is the only table that can rank two bundles.** Rules:

- A change is adopted when A-only is larger than B-only **and** the projected mean time is not worse.
- A difference of one task is noise at any panel size. With 30 paired tasks, a true gain of 10 percentage points with no losses is detected 7% of the time (section 6).
- When three runs of each bundle exist, pair run 1 with run 1, run 2 with run 2 and run 3 with run 3, and add the three tables.

###### 3.7 Per task

One line per task with every counter, for the traces you decide to open.

---

##### 4. Reading one task

| Start from | Then | Conclusion |
| --- | --- | --- |
| `agent_patch_size` is 0 | `tool_calls` and the trace | The agent never edited: a localization failure, a refusal loop, or a budget that ended first |
| `error` mentions "Failed to apply agent patch" | `patches/<id>.patch` | The edit is not a clean text diff |
| `test_exit_code` is 1 | the `FAILED` lines in `test_outputs/<id>.log` | The fix is wrong or incomplete, or a sibling test in the same file broke |
| `test_exit_code` is 2 to 5 | the collection error | The patch broke an import, or a fixture is missing |
| `error` says "Required test node did not pass" with exit 0 | the skipped tests in the log | A required test was skipped: an unsatisfiable task or a skip the fix caused |
| Resolved, but the projected time is near the cap | the call list | A win that would not survive a slower scorer |

For a resolved task, still read the first-edit time and the call count: the cheap wins are the ones to protect when a lever changes the early phase of a task.

---

##### 5. Compliance checks on a trace

The brain has rules that the score cannot show. Check them on three tasks per run (one per repository), by hand from `logs/<id>.log` or through the tool's counters.

| Check | Pass condition | Where |
| --- | --- | --- |
| The installer ran once, first | The first tool call of the task is the skill call, or the installer reports a re-entry | Trace, first `tool_calls` |
| The baton was relayed verbatim (relay bundles only) | The planner's final text equals the `<<<BCF-SPEC` block printed by `plan` | `logs/<id>.log` |
| Every file change went through the helper | No `edit_file`, no `write_file`, no `python3 -` heredoc that opens a file for writing in the solver's calls | Trace, `arguments` of `run_command` |
| The first edit exists by call 10 (31B) or call 6 (E4B) and before the governor's first gate | The first `APPLIED` appears before that | Trace |
| Verification happened | At least one `repro` or `test` call, and for P1 and P2 routes a repro that failed before the fix | Trace |
| `finalize` ran before `submit_patch` | Both present, in that order, `patch_size` above 0 | Trace |
| No protected path was edited | "Patches touching protected paths" is 0 | Report table 3 |
| No list argument was emitted | "List-argument calls" is 0 | Report table 3 |
| No tool call after `submit_patch` | The last tool call is `submit_patch` or nothing follows it | Trace |
| Thinking stays inside its budget | `max in one call` is below the output cap | Report table 2 |

A bundle that passes all ten and scores lower than one that fails three is still the better bundle: the failures are what the slower scorer will punish.

---

##### 6. Local results against the official score

###### 6.1 What the evidence says

| Finding | Source | What it means for reading a local run |
| --- | --- | --- |
| Byte-identical submissions scored 0.17 and 0.24, and 0.15 and 0.20 | Discussions 757588, 760924 | A single leaderboard value has a band of about 4 tasks (0.07) |
| The per-task flip rate between identical runs is 10 to 19% | arXiv 2611.19359; discussions 758969, 758954 | The band comes from tasks flipping, not from a different score formula |
| A pooled estimate of the standard deviation is about 1.5 tasks per draw; identical configurations disagreed on 5 to 8 of 129 tasks locally | 759329 (reply), 760595 (Adam Johnson) | Local single runs have the same kind of noise as the leaderboard |
| A real gain of two tasks is misranked 11 to 20% of the time with one run; a three-task effect needs 4 to 8 repetitions of the full set for p below 0.05 | 758954, 760595 | One run can rank nothing that differs by less than about four tasks |
| Local scores correlate with the leaderboard for a plain single-agent prompt, and stop correlating for elaborate multi-agent bundles that solved locally and scored 0.06 to 0.08 | 760924 (Murugesan Narayanaswamy) | The further a bundle is from a plain agent, the more the scorer's speed and compaction punish what worked locally |
| A local tie of 28 of 74 scored 0.17 and 0.10 | 751973 | Local rank inside a tie is meaningless |
| The scored tasks come from private repositories and "behave very differently" from the 129 public tasks | 756400, 745998 | The public panel is a ranking signal, never a calibration of the absolute score |
| Reference points on the public tasks: agentless with the unquantized model 47 of 129; the 31B model through the same harness 54 of 124 for a competitor; the top of the leaderboard is 14 of 58 | 758218, 761060, leaderboard capture | Public-task rates of 35 to 45% coexist with a leaderboard top of 24% |

###### 6.2 The arithmetic of one leaderboard value

One task is 1/58 = 0.0172. If each task flips between two runs of the same bundle with probability f, the difference between two single runs has a standard deviation of `sqrt(2 x 58 x f x (1 - f))` tasks:

| Flip rate f | Standard deviation of a difference | One-sigma band in score | A difference you can trust (two sigma) |
| --- | ---: | ---: | ---: |
| 0.10 | 3.2 tasks | 0.056 | about 0.11 |
| 0.15 | 3.9 tasks | 0.067 | about 0.13 |
| 0.19 | 4.2 tasks | 0.073 | about 0.15 |

So a leaderboard move from 0.20 to 0.22 between two single submissions is inside the noise, and a move from 0.17 to 0.24 is about one sigma. **The leaderboard confirms that a submission ran and scored in the expected band. It does not rank bundles.**

###### 6.3 What a local panel can and cannot detect

Exact power of the paired sign test at the 5% level, computed for this document (`scratch/2026-11-24-bcf-tuning-parity/scripts/paired_power.py`):

| Effect of the change (gain g, loss l per task) | 30 pairs | 90 pairs | 129 pairs | 387 pairs |
| --- | ---: | ---: | ---: | ---: |
| +10 points, no losses (g = 0.10, l = 0) | 7% | 90% | 99% | 100% |
| +10 against 2 (g = 0.10, l = 0.02) | 5% | 50% | 71% | 100% |
| +5 points, no losses (g = 0.05, l = 0) | 0% | 29% | 63% | 100% |
| +5 against 1 (g = 0.05, l = 0.01) | 0% | 15% | 32% | 89% |
| +7 points on top of a 27% flip rate (g = 0.17, l = 0.10) | 5% | 18% | 27% | 73% |
| +7 points, no losses (g = 0.07, l = 0) | 2% | 61% | 89% | 100% |

The table says what the board has been saying: one run of a 30-task panel cannot see a ten-point improvement, and three runs of it see it only when the change loses nothing. Repeats of the same tasks are not independent observations, so the multi-run columns are optimistic; treat them as upper bounds.

What follows for the workflow:

| Local can decide | Local cannot decide |
| --- | --- |
| That a change removes a failure class (the outcome table moves) | The leaderboard value of the resulting bundle |
| That a change lowers time and tokens per task | Whether the hidden repositories behave like the public ones |
| That a change is not worse on paired tasks, when the effect is large or loss-free | Differences of one or two tasks |
| That the brain follows its own rules (section 5) | Backend failures, the queue, the silent 0.00 |
| That the projected mean fits the clock | The real setup cost on the scorer |

###### 6.4 Building your own calibration line

Keep one row per official attempt and one row per local panel run of the same bytes:

| Field | Why |
| --- | --- |
| Date and time of the submission (UTC) | Queue position and the 24-hour rhythm |
| Bundle name and SHA-256 | The link between the local run and the scored run |
| Local panel: tasks, resolved in each of three runs, mean and p90 projected seconds | The predictors |
| Hours from submission to score | A very low score with a long latency is an infrastructure fault, not a draw (759329) |
| Public score and the result size | The outcome; about 3,230 bytes means a backend failure, not a score |

After three attempts you have three pairs (local mean, public score). Do not fit a line: read whether the local mean predicted the band (plus or minus 0.07) each time. A bundle whose local panel is 6 tasks better than another's is the one to select as a final, whatever the two public scores say, because the private leaderboard is one draw (Document 02 of the RCA package, section 10.1).

---

##### 7. From results to a tuning plan

###### 7.1 Failure class to lever

Read the outcome table of a run, take the largest unresolved class, and use the row. The lever numbers are those of Task 2, Part B.

| Class in the outcome table, or the counter | Most likely cause | Levers | Confirm with |
| --- | --- | --- | --- |
| `no edit: calls exhausted` | Localization or refusal loop consumed the calls | 4 (prompt length), 6 (localizer), 14 (routes), 2 (earlier first-edit gate) | Refused edits and first-call time in table 3 |
| `no edit: time` or `edit but time ran out before submit` | Too many tokens per call | 1 (thinking budget), 2 (gates), 12 (output cap), 13 (planner thinking) | Table 2 and the projected mean |
| `required test failed or skipped` on P1 and P2 routes | The repro was not a real oracle | 15 (hints), the fail-first rule of the prompt | Repro results in the trace: passed before the fix? |
| `required test failed or skipped` on P3 routes | Wrong file or wrong guess | 6, 14, 15 | The first `ctx` target against the gold file |
| `pytest error` | The patch broke an import | The compile gate cannot see imports: add an import smoke test for new modules | The traceback in the log |
| Refused edits high | Search text not copied exactly, or non-unique | 4 (the worked example), 10 (drop `read_file`) | Two refusals read by hand |
| Nudges present | A turn ended without `submit_patch` | 12 (output cap), the finish rule of the prompt | The nudge variant in the trace |
| Compactions present | Context grows too fast | 4 (shorter prompt), helper output caps | Prompt tokens per call in table 2 |
| Projected mean above 300 | Everything is a little too slow | 1, 2, 3 (the cap itself), 9 | Projected hours in table 1 |
| Resolved by route: one route at zero | The procedure of that route is wrong | 14, 15 | Breakdown table |

###### 7.2 The loop

1. **Read** the report of the last run. Write down the largest unresolved class and its count.
2. **Pick one lever** for that class. One at a time, so that the next run attributes the change.
3. **Tiers**: T0 (build, compiler) and T1 (helper tests, replay, localizer) for every change; T2 (smoke) for a prompt change; T3 (ranking panel, three runs, paired against the baseline) for anything that claims a score effect.
4. **Decide before the run**: write the adopt condition in the ledger of Task 2 (C.5).
5. **Decide after the run** with the paired table: adopt, reject, or "inconclusive: more pairs".
6. **Update the baseline** only on adopt; keep its results folder as the new reference.

###### 7.3 Two worked readings

The numbers are illustrative and chosen to show the reasoning, not measured.

| Situation in the report | Reading | Action |
| --- | --- | --- |
| 30 tasks; 9 resolved; 6 `no edit: calls exhausted`; refused edits 31; p90 calls 28 | The agent spends its calls on edits that do not apply | Open two refusals. If the search text differs from the file by whitespace, the flexible matcher should have accepted it: look at the blocks. If the same block is sent twice, the prompt's rule is not followed: lever 4 or 10 |
| 30 tasks; 12 resolved in all three runs; projected mean 340; p90 520; 4 tasks over budget | The score is stable and the time is not | Levers 1 and 2 first (thinking 2,048, earlier gates); re-run the speed panel; adopt if the projected mean falls below 300 and the resolved count in the paired table does not |

---

##### 8. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| `swegemma` 0.2.11 (`results.py`, `evaluate.py`, `harness/verification.py`) and `adk-eval-core` 0.1.0 (`tracing/trace.py`, `tracing/atif_converter.py`) | Kaggle wheelhouse v31 | read 2026-11-24 | The artifacts, the meaning of `duration_seconds`, the trace format |
| [Variation is the biggest differentiator](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760924), [Where a small E4B agent loses tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595), [thinking-budget and noise advice](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329), [scorer-minutes](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954), [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004) | competitors | 2026-10 to 2026-11 | Local-versus-leaderboard evidence, noise, the 3,230-byte signature |
| [One Run Is Not Enough](https://arxiv.org/abs/2611.19359) (arXiv 2611.19359) | cited through the RCA package | 2026-11 | Flip rate |
| [statsmodels `mcnemar`](https://www.statsmodels.org/stable/generated/statsmodels.stats.contingency_tables.mcnemar.html) | statsmodels | fetched 2026-11-24 | The exact binomial form of the paired test |
| `03_Validation_Results_and_Submission_Playbook.md` (the 30-task panel and its exclusions) | this project | 2026-11-24 | Section 2 |
| Power tables | computed for this document | 2026-11-24 | Section 6.3 |

### F6. Testing trials, metrics, and result analysis

*Attached in full, as written on 2026-10-31. Its own title: “05 · Testing Trials, Metrics, and Result Analysis.”*

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware, `02` Windows, `03` Zorin, `04` harness usage, `06` BCF improvement loop, `07` submission & local scoring, `08` troubleshooting, `09` sources.*

This file answers: how do I structure local runs (“trials”), which numbers do I read, what is noise and what is signal, and how do the local numbers relate to the Kaggle leaderboard? Everything quantified here traces to the 2026-10-31 intel register (threads 753524, 743506, 751487, 751707, 751973, 750974, 751596, 753793, 744319, 750573) — each load-bearing number carries its thread ID.

---

##### 1. The metric stack

| Level | Metric | Definition | Where it comes from |
|---|---|---|---|
| Task | `resolved` | Phase-2 verdict: patch applies (4-pass), anti-tamper clean, hermetic pytest exits 0 with passed>0, failures=0, errors=0, no skipped required tests | `task_results.jsonl` |
| Run | **Resolution Rate** | `resolved / total` in [0,1] — the competition metric | `summary.json` |
| Run (secondary) | patch-submission rate, mean tool calls/task, mean turns/task, median per-call latency, output tokens/call | efficiency diagnostics; they explain *why* a run resolved what it did | ATIF traces + `logs/` |
| Public LB | displayed score | `floor(tasks/58 × 100)/100` — **truncation, never rounding** | Kaggle |
| Rig health | gold-patch pass rate | % of the 129 tasks whose *gold* patch resolves in your sandbox | your `--skip-agent-patch` runs |

Three rules that follow directly:

1. **Never round.** 1 task = 0.0172 displayed (1/58 = 0.017241 pre-floor); the LB’s six structurally unreachable “hole” scores (0.16/0.19/0.21/0.23/0.26/0.28) exist precisely because of truncation. A local metric that rounds disagrees with the LB by up to half a task, systematically. Copy the exact function: `score = math.floor(k/58*100)/100` for k in 0..58.
2. **Rig health gates everything.** Until gold patches pass **127/129** in your sandbox (§4 of `04`; the 2 holdouts have internally contradictory skip conditions — don’t chase them), you are measuring your environment, not your agent.
3. **Public-LB deltas under ~2 tasks are noise.** Measured σ ≈ 1.0 task per 7-task repetition ≈ 2 per 58-task draw (753524, 200+ runs); of 39 well-sampled task×config cells, ~67% are “flippy” (sometimes pass, sometimes not), ~23% never-solve, ~10% always-solve.

##### 2. Noise: the numbers to internalize

| Anchor | Value | Source |
|---|---|---|
| Same-config repeat pairs | landed 0 apart twice in direct measurement | 753524 |
| σ per 7-task rep / per 58-task draw | ~1.0 task / ~2 tasks | 753524 |
| Coin-flip upper bound, same run | ~2–3 tasks | 753524 |
| Identical agent files, public LB | 0.12–0.22 spread | 750974 |
| Identical files, task counts | 7–13 of 58 | 751596 |
| One package resubmitted 4× | 0.17 / 0.15 / 0.13 / 0.15 | 748051 |
| 133-vs-77-run experiment (+9 pts) | only p = 0.22 | 753524 |
| 154-run replay of a budget-cap change | null (net −1); community “budget lever” claim retracted by OP | 753524 |
| 35 of 38 multi-file golds | never solved by anyone — a quarter of the practice pool is structurally dead | 753524 |
| Frontier rate | ~30% task pass matches the frontier when run Kaggle-side on all ~129 | 752848 |

**Trial-sizing rule (inferred from the above):** treat 1–4-task single-run gaps as noise; never trust a public delta < 0.02; repeat a promising config before believing it; and **prefer paired, token-budget-matched runs on a fixed task set** (751596’s 98-paired-task pattern, 753793’s matched repeats) over raw run count — even 210 unpaired runs gave p = 0.22.

##### 3. Trial protocol

###### 3.1 The standard trial (what one “experiment” is)

A trial = **one config change** × **one fixed task panel** × **N paired runs**, with the pair-mate being the parent config. Concretely:

```text
panel/
  PANEL_A.txt     # 28 fixed instance_ids, stratified: 12 fastapi, 10 rich, 4 requests, 1 httpx, 1 known-flippy
runs/
  parent_r1/      # identical seeds/budgets as child
  child_r1/       # the ONE mechanism you changed
  parent_r2/ child_r2/ ...   # N=2 minimum, 3 when a cell is flippy
```

Why paired: identical files swing 7–13/58 (7515596) — unpaired A/B at these effect sizes measures the draw, not the change. Why stratified: the pool is only 4 repos (fastapi 67 / rich 48 / requests 13 / httpx 1), so a random 20-task panel is usually 12+ fastapi and over-weights starlette-shaped failures.

Panel selection rules:

- Include **≥1 known-flippy cell** (a task your agent solves ~50% of runs) — it’s your live noise gauge.
- Exclude the **8 SSL-dead requests tasks** (6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505 — `VERIFY_X509_STRICT` vs `pytest-httpbin` cert on Python 3.13), the **3 version-gated** tasks (`fastapi_14186`, `fastapi_15745`, `rich_3486` — `@needs_py_lt_314` skips on any 3.13.x), and `rich_3472` (error-string drift) from *CV panels* — they distort public-set numbers only; the hidden set is clean (staff 744370: gold scores 100% on hidden tasks).
- For generalization reads, add the community suites: **OOD-45** (45 post-Gemma-4-release fixes from 17 projects; dataset `rodrigospalma/ood45-bugfix-split`, notebook `rodrigospalma/ood45-evaluate-your-agent`) and **FreshSWE-Py** (663 validated post-release tasks from 33 repos in this competition’s exact layout; dataset `moshegolderson/freshswe-py`, with a score-your-own-patches notebook). Both are free pre-scoring surfaces — use them before spending submission slots.

###### 3.2 Statistics (the whitepaper protocol, executable locally)

- **Paired exact McNemar** on PASS/FAIL per task between parent and child — the only test with real power at these panel sizes.
- **Holm correction** across the ladder when you test several mechanisms at once (as the A0–A5 ablation does; see `06`).
- **Wilson intervals** on every proportion you report (resolution rates, per-repo rates). Never bare percentages.
- **Three seeds** on any cell whose variance exceeds its mean effect — temperature 0.2 is not 0; identical configs flip.
- Pre-register the refutation condition *before* the run (the BCF ladder does this per mechanism; copy the pattern).

One-line McNemar in Python (exact binomial on discordant pairs):

```python
from math import comb
def mcnemar_exact(b, c):   # b = parent-pass/child-fail, c = parent-fail/child-pass
    n = b + c
    p = sum(comb(n, k) for k in range(0, min(b, c) + 1)) / 2**n * 2
    return min(p, 1.0)
```

###### 3.3 Efficiency metrics to capture per run (from ATIF traces)

| Metric | Why it matters | Known-good anchors (31B, 4×L4) |
|---|---|---|
| decode throughput | server health check | 33–35 tok/s (12B: 62–64 — decode only, see below) |
| output tokens per call | dominates per-call latency | median 127 (12B: 233) |
| median per-call latency | the real speed number | 10.3 s (12B: 11.5 — **slower**) |
| patch-submission rate | are edits landing at all? | 81–84% (E4B: 97% but wrong-file 13/31) |
| tool calls / task, turns / task | budget-burn shape | starter targets 8–10 turns |
| resubmit loops (identical rejected calls) | parser-trap symptom | 64 exact blind resends in the wild (747519) |

**The 12B lesson, quantified (750974 + Zhukov 24-task benchmark):** decode ~1.9× faster is cancelled by ~1.8× more output tokens per call (median 233 vs 127) and ~1.5× more per task (~12,400 vs ~8,100); net per-call latency 11.5 vs 10.3 s; 12B solved 4/31 vs 31B’s 9–11/31 at every tested budget; and a 12B LB submission at the 8-min limit did **not** finish inside the 12 h clock (slot burned, zero score). Never adopt a “faster small model” for end-to-end work on decode numbers alone.

###### 3.4 Time budgeting a trial

Per-task Stage-1 wall clock is bounded by your eval_config (use 5–8 min/task for 31B-class panels); Phase 2 adds verification time **excluded** from the task budget but not from your evening. Practical planning numbers on a single 5090 (tp=1, QAT 31B, 32k ctx): expect **sub-linear pain** vs the 4×L4 rig — throughput roughly halves per streaming sequence at equal batch, and vLLM batches concurrent tasks only if you raise `--concurrency`; measure your own `tok/s` on day 1 and size panels from it, not from L4 numbers. A 28-task panel at ~6 min/task mean ≈ **2.8 h serial**; two shards on one GPU do not stack (one server), so parallelize by *shard across time*, not concurrently, unless you run separate model instances on smaller variants.

##### 4. Analysis workflow per run (the 30-minute post-run checklist)

1. **Read `summary.json` first**: resolution_rate, per-repo breakdown, errors count. Per-repo divergence (e.g. fastapi 0 / rich 0.4) is almost always an environment signature (starlette wheel pin!) or a prompt bias, not a model property.
2. **`--skip-agent-patch` control if anything moved**: if gold-pass changed since your last control run, the environment drifted — quarantine all agent conclusions from that day.
3. **Diff the panels pairwise** (parent vs child) at task granularity; feed the discordant set to step 4.
4. **Read 3 traces from each side of every discordant task**: did the child fail at P1 (spec), P2 (localization), P3 (edit mechanics), or P4 (validation)? The failure *layer* — not the pass/fail — is what generalizes. (This taxonomy is the BCF ledger’s core; see `06` §2.)
5. **Check the parser traps**: any task ending with 0 LLM calls at high wall-clock = probable array-arg hang (753973); any run of rejected `edit_file`/`write_file` with identical retries = backtick trap (747519). Both are *harness-level* losses — remove them from the agent-quality numbers and fix the prompt/scaffold instead.
6. **JUnit size guard**: any `junit*.xml` > 10 MiB means the task could never pass regardless of patch correctness (sandbox output cap truncates the report — 8 python-multipart cases in the wild, 751707).
7. **Write the ledger row** before starting the next run (see `06`). Unrecorded runs are noise you paid for.

##### 5. Local → leaderboard: what transfers and what doesn’t

| Local finding | Transfers to LB? | Evidence |
|---|---|---|
| Environment-level failures (wheels, sandbox, parser) | **Yes** — fix locally, score benefits immediately | 743973/744370/751487 chain: CV/LB anti-correlation (CV 0.18→LB 0.05) resolved entirely by environment repair |
| Scaffold mechanisms (spec-first, gates, budget policy) | Partially — directionally, not rank-preserving | 751973 open-sourced full pipeline: “our local screen never ranked our hidden scores”; two configs tied 28/74 locally scored 0.17 vs 0.10 hidden; a 9–0 local winner scored *lower* hidden |
| Per-task solve/no-solve | Weakly | ~67% of well-sampled cells flippy (753524) |
| Timing safety margins | **Yes, conservatively** | 752017: +5% median local time = 12 h overrun on hidden repos; budget per task via eval_config.yaml |

The operating posture this implies: **use local runs to eliminate failure modes and validate mechanisms, not to pick winners**; pick finals by public-LB evidence at ≥2-task margins; and hold the 12 h global clock as the binding constraint when a config adds any per-task cost (staff’s only sanctioned lever is eval_config.yaml budgeting — defaults are “no limit,” which is how 752017 died).

##### 6. Bonus-track (E2B/E4B) trial targets

The $10,000 small-model bonus requires the E-series run to be one of your **two final submissions** (staff 751104; private = better of the two, 752220). Field evidence as of 2026-10-31: **zero publicly identifiable E-series teams on the main board**; the only E4B activity is bug reports (rank 48, eligibility unconfirmed). Working targets from the intel brief: **~0.10 (6 tasks) = comfortable win; 0.06 (4) = real shot; 0.12–0.13 (7–8) = safely ahead of any foreseeable E-field**.

Known E4B-specific failure layers to design trials around (each is a separate experiment, don’t conflate):

1. **Capability floor**: 0/31 at 5-min limit, 97% patch rate but **wrong file in 13/31**, sometimes whole-file overwrites (750974, same agent files as a 31B solving 9–11/31).
2. **Copy fidelity (QAT-specific)**: trailing-`s` drops (“directs”→“direct”) breaking exact-match edits; unmodified QAT failed 15/18 copy probes, SVD rank-128 LoRA 1/18 (753277; repro repos `michi883/gemma-copying-tensor-fix`, dataset `michi883/ple-proj-svd-r128`; rules-permissiveness of weight modification unadjudicated — check before relying on it in a submission).
3. **Serving path**: intermittent scorer “incorrect format” on validator-passing E4B bundles around 2026-10-22/23 (752128), incl. one bundle that scored one day and failed unchanged the next; unresolved, staff unanswered.
4. **LoRA-on-E scorer compatibility**: vLLM 0.19.x Gemma-4 LoRA errors (issue #40693, candidate fix PR #39291 — inclusion in the scorer build unknown, 752239 unanswered) **and** a report that scorer-side PEFT cannot load adapters on `Gemma4ClippableLinear` at all (753388, unverified, 0 comments). Local LoRA success proves nothing about the scorer.

**Consequence for trials:** the E-series trial loop should first establish the *edit-targeting* fix (wrong-file rate), then the copy-fidelity fix, then attempt LoRA *canaries* (C1 in `06`), and only then consider slots — holding a non-LoRA E-series run as the safe final-slot fallback until staff answers 752239/753388.

---

*Sources: intel brief 2026-10-31 register (753524 L69, 743506, 751487 L71, 751707 L103, 751973 L102, 750974 L105, 751596 L104, 748051 L106, 753793, 744319, 750573 L109, 752017 L101/115, 752128 L100, 753277 L72, 753388 L96, 752239 L98, 751104 L64, 752220 L99, 748287 L65); leaderboard analysis 2026-10-31; `03-bcf-simulation-httpx-3672` (2026-09-30). Full list in `09-sources.md`.*

### F7. Improving the BCF brain from each run

*Attached in full, as written on 2026-10-31. Its own title: “06 · Improving the BCF Brain from Each Run — The Ledger → Config Loop.”*

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware, `02` Windows, `03` Zorin, `04` harness usage, `05` trials & metrics, `07` submission & scoring, `08` troubleshooting, `09` sources.*

This file operationalizes the BCF (Bug-Cause-First) scaffold on the local rig: what each run must record, how the records become failure taxonomy, and how the taxonomy becomes the next run’s configuration. It is the executable version of the formal spec (`deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/01-bcf-formal-specification.md`) and the whitepaper §5 ablation protocol (`02-kaggle-whitepaper-draft.md`) — every mechanism below carries its anchor in those files.

The one-sentence theory being tested: **a scaffold that writes down *why* each task failed, in a shared vocabulary, can start task #90 warmer than task #1** — expressed as the turn-budget model `E[T_bcf] = c_spec + c_graph + (1 − q)·m·r` (whitepaper §3), where `q` is the probability the P1 spec orders the fix correctly on the first attempt, `m` the edits-per-fix constant, and `r` the per-edit retry rate. Every loop iteration below exists to raise `q` or lower `r`.

---

##### 1. The phase machine (what “compliance” means, checkable from traces)

Each phase has a defined entry condition and exit artifact — which makes scaffold compliance **mechanically checkable from the run’s ATIF trace** after the fact (whitepaper §2). Your local checker asserts, per task:

| Phase | Entry | Exit artifact (what the trace must show) | Check |
|---|---|---|---|
| P1 Specification | task issued | per-bug record: **Hypothesis** (falsifiable statement of what is wrong) + **Target** (candidate file:symbol) + **Fix-shape** (minimal change description), plus causal fix order for multi-bug tasks | spec-before-read: the decomposition exists **before the first `read_file`** |
| P2 Localization | spec written | dual symbol search over the indexed call graph — definers and callers of the specced symbol — before any workspace grep | graph-first: ≥1 `search_similar_code`/`get_code_neighbors` call precedes the first `edit_file` |
| P3 Edit | target confirmed | every mutation passes a deterministic **gate** pricing scope (files ∪ symbols ∪ tests affected) and verification coverage (tests exercising scope / tests touched) | gate-use: no `edit_file`/`write_file` without a preceding gate decision in the same turn |
| P4 Validation | patch built | targeted tests = failing tests + their graph-neighborhood passing tests; on failure, **one** bounded retry then rollback | targeted-only: no bare `pytest`, no full-repo sweeps; retry count ≤ 1 |

Phase-2 subtlety the rig must respect: `search_similar_code` is **symbol-name** lookup offline (cosine over the `.npz` dictionary keys — “SSE” hits, “Server Sent Events” returns 0), so the scaffold’s graph queries emit class/function/module names, never prose. The community’s independent finding (745731) — plain `grep` beats the shipped graph tools on wall-clock — is *compatible* with graph-first: P2 uses the graph for **definer/caller semantics** (what grep cannot give) and the prompt may authorize grep as a secondary; the check is that the *first* localization action is a graph query, not that grep is banned.

Anti-tamper note (verified live, httpx_3672): Phase 2 resets **all** test files to baseline and applies the harness’s own `test_patch` — agent edits to tests are discarded, and the visible suite can contradict the graded one. P4’s “targeted tests” are therefore a *decision aid*, never a grading oracle; the scaffold must treat “the suite I can see” as adversarial input.

##### 2. The per-task ledger (what every terminal task appends)

Verbatim field list (whitepaper §2 “Post-mortem accumulation”; formal spec §6.1–6.2). One row per task, appended regardless of outcome — failures are the payload:

| Field | Content |
|---|---|
| `failure_signature` | normalized shape of the failure (see taxonomy §3) — not the raw text |
| `phase_reached` | P1/P2/P3/P4/terminal-verified |
| `localization_path` | graph-first vs grep-first vs spec-blind; symbols queried |
| `turn_counts` | turns to spec, to first edit, to submit; total |
| `gate_decisions` | each gate’s scope price and coverage ratio |
| `budget_consumption` | tool calls, wall clock, output tokens |
| `patch_shape` | files touched, hunks, added/deleted lines; multi-file yes/no |
| `outcome` | resolved / patch-rejected / test-failed / timeout / budget-exhausted / parser-trap |
| `retry_chain` | edit retries with rejection reasons (exact/flexible/regex tier that matched) |
| `notes` | one line: the falsifiable “next time” hypothesis |

**Fidelity ladder** — how much of this you reconstruct, at what cost (formal spec §6.1):

| Rung | What the run emits | Cost |
|---|---|---|
| **L0 decision ledger** | one row per gate decision / phase transition / submission | ~100 B/row, **always on** — “reconstructs the run” |
| **L1 tool-level ledger** | + every tool call with args-shape, tier matched, latency | from ATIF traces automatically |
| **L2 semantic ledger** | + spec content, hypothesis tests, RCA rows | requires the scaffold’s own emission (prompt discipline) |

Design rule: **L0 is mandatory from run #1**; L1 is free (the traces exist anyway — `04` §6); L2 arrives with prompt maturity. The improvement loop only works if L0/L1 are never skipped on “quick” runs — that is where the recurrence statistics come from.

##### 3. Failure taxonomy → codebook → config delta (the loop itself)

Formal spec §6.3 (and C7 in the articles table) defines the loop; on the rig it is a weekly batch job:

```text
run → ledger rows (L0–L1, +L2 when present)
    → failure_signature clustering (exact-normalized strings, not embeddings)
    → RCA rows (one per cluster: phase, mechanism, evidence links)
    → taxonomy/codebook delta (candidate new classes; merges; retirements)
    → config delta (prompt instruction, gate parameter, budget policy, model/adapter)
    → next paired trial (05 §3.1) → accept/reject by McNemar → merge codebook
```

Grounded starter taxonomy (seed classes from the intel register — each with its known fix lever):

| Signature class | Observable shape | Lever |
|---|---|---|
| `parser:backtick-arg` | rejected edit_file/write_file with identical blind resends | prompt rule: never end string args with a backtick; cap resends at 1 (747519) |
| `parser:array-hang` | task ends with 0 LLM calls at high wall-clock; server CPU-pinned | no array-typed tool args anywhere; smoke-test call strings (753973/745138/746336) |
| `budget:stage-starvation` | multi-agent bundle: 7/8 timeouts originate in stage 1 | one shared EvaluationBudget per task — sequence stages, budget inside the envelope (747519) |
| `budget:12h-overrun` | LB run ends Notebook Timeout ~12 h | any +per-task cost needs headroom vs the global clock (752017) |
| `scorer:anyio-fixture` | tests requesting `anyio_backend` fixtures fail under `-p no:anyio` | prompt: reproduce without anyio plugin fixtures (751707, 79 cases) |
| `scorer:skip-counted-fail` | “20 passed, 1 skipped” marked unresolved | avoid platform-skips; exact-name test targeting (751707; `node_matches_requirement` prefix bug — swegemma 0.2.11) |
| `scorer:junit-oversize` | report > 10 MiB truncated ⇒ unresolved despite all-pass | suppress verbose output in touched suites (751707, 8 cases) |
| `env:wheel-pin` | per-repo gold-pass collapse (fastapi starlette signature errors) | rig-side: five missing test packages + period-correct pins (751487) |
| `edit:wrong-file` | patch lands in a non-causal file (E4B: 13/31) | P2 gate: no edit without definer/caller confirmation (750974) |
| `edit:copy-fidelity` | trailing-char drops breaking exact match (E4B QAT) | prefer regex-tier edits / smaller anchors; copy-test before panels (753277) |
| `spec:unfalsifiable` | P1 hypothesis not testable as written | prompt rule: hypothesis must name observable symptom + would-be-falsifier |

**Recurrence-rate metric** (whitepaper §4, falsifiable): the frequency of a previously-seen failure signature should **fall** as runs K grow, because the scaffold consults the codebook. Track `P(signature class c recurs at run k) / P(c at first appearance)` per class — this is the scaffold-learning signal, independent of resolution rate, and it moves at panel scale (n≈28) where resolution rate doesn’t.

##### 4. The A0–A5 ablation ladder as a *runnable local recipe*

The whitepaper §5 ladder is pre-registered with one added mechanism per rung and a refutation condition per mechanism. On the rig it becomes six configs over the fixed panel:

| Rung | Config delta vs parent | Mechanism under test | Pre-registered refutation |
|---|---|---|---|
| **A0** | minimal ADK agent, no BCF (the starter, budgets raised) | baseline | — |
| **A1** | + P1 spec gate (C3/C4) | spec-before-read | if spec-writing cost (turns) ≥ solve-rate gain on spec-orderable tasks → refute |
| **A2** | + P2 graph-first localization | definer/caller before grep | if graph queries add turns without reducing wrong-file edits → refute |
| **A3** | + P3 gates (C5) | scope/coverage pricing before edits | if gate overhead exceeds retry savings → refute |
| **A4** | + P4 targeted validation + bounded retry | test-neighborhood targeting | if full-suite runs resolve ≥ targeted at equal budget → refute |
| **A5** | + ledger/codebook consultation (in-run accumulation) | warm-start from signatures | if recurrence rate does not fall with K → refute |

Running it: 6 rungs × 2 paired runs × 28-task panel ≈ 12 runs ≈ 34 h wall on a 5090 at ~6 min/task — one week of evenings. Statistics per `05` §3.2: exact McNemar per rung vs parent, Holm across the ladder, Wilson intervals everywhere, three seeds on flippy cells. **All ladder numbers are protocol-declared, not yet measured** (whitepaper §7 limitation — this rig is where they get measured first).

**BCF-E variant (E4B deltas from the bonus plan §3):** spec fields compress (shorter Hypothesis/Target/Fix-shape); graph queries go **eager** (“always run the definer/caller search immediately after spec” — small models skip optional steps); gates simplify to file-scope-only (symbol pricing costs turns E4B needs elsewhere); P4 retry budget drops to 1. Test these as rung-A′2/A′3 on the E-track, not as assumptions.

##### 5. LoRA experiments: canary gates before slots

Standing evidence: LoRA nulls on **both** E4B and 31B with infra fixed (753793 three-arm E4B null — full-trajectory SFT, filtered, targeted-format — none beat no-adapter; 750713/750961 31B nulls), and the historical nulls were confounded by the sample adapter being a **layer-0 stub** (r=4, alpha=8, `layers_to_transform [0]`, q_proj+o_proj only — staff 749528 note). The shipped starter adapter is exactly that stub: **do not treat it as a baseline**, treat it as a placeholder shape.

Canary protocol (bonus plan §4) — run locally, in order, before any adapter touches a submission slot:

| Gate | Setup | Pass condition | Fail action |
|---|---|---|---|
| **C1 no-op canary** | rank-1, near-zero-init adapter on the target variant | score within noise of bare baseline (±3 tasks ≈ ±0.05) | adapter loading itself perturbs serving — fix integration before training anything |
| C2 signal canary | rank-r adapter trained on ~100 copy-fidelity cases (the 753277 repro set) | copy-test failures drop vs C1 baseline | capability not reachable via LoRA at this rank/scope — escalate rank or abandon |
| C3 task canary | best C2 adapter on the E-panel | paired McNemar vs bare E4B on 28 tasks | keep the bare run as the final-slot candidate |

Scorer-compatibility gates (unresolved as of 2026-10-31, both staff-unanswered): vLLM 0.19.x Gemma-4 LoRA errors — issue #40693, candidate fix PR #39291, scorer inclusion unknown (752239); scorer PEFT reportedly cannot load adapters on `Gemma4ClippableLinear` (753388, unverified). **Until answered: hold a raw-base non-LoRA E-series run as one of the two final submissions** (751104 requires the bonus entry to occupy a final slot; private = better of two, 752220, so the hedge is free).

Training-side notes for the 5090 (details in `01`/`02`/`03`): adapters for QAT bases must be trained **against the unquantized variant** (staff guidance, 748287) then served over the QAT base; keep `max_lora_rank ≤ 128` and total adapter bytes inside the 3 GiB envelope (r=16 ≈ 110–220 MB … r=128 ≈ 0.9–1.8 GB per adapter, 8 concurrently served max).

##### 6. The improvement loop’s decision rules (when to change what)

| Evidence from the loop | Config change |
|---|---|
| Signature class recurs across ≥3 runs, fix lever known | patch the prompt/scaffold rule; add a codebook entry; re-run the class’s discordant tasks as the next panel |
| Wrong-file edits dominate (P2 failure) | tighten the P2 gate: require definer+caller confirmation before first edit; if E-track, go eager-graph |
| Turn counts rise, resolution flat | budget policy: raise `max_output_tokens` headroom (truncated `<\|tool_call\|>` tags waste whole turns) or drop spec verbosity (BCF-E compress) |
| Recurrence rate flat across K | the codebook isn’t being consulted — check L2 emission (prompt discipline) before blaming the model |
| A rung’s refutation condition fires | drop the mechanism, log it in the ladder table, keep the parent — the ladder is a search, not a ratchet |
| Public LB contradicts a confident local result at ≥2-task margin | trust the LB; re-audit the environment first (05 §4 step 2), the scaffold second |

**Effort Governor** (formal spec §7) — the thinking-budget policy table to encode in `generate_content_config` per phase: P1 spec/task start = high (≥4,096); P2 localization queries = low; P3 first edit = medium; P4 validation reads = low; retries/rollback = high. (On the vLLM path this is `thinking_budget` shaping, not `thinking_level` — `04` §5.)

**Finals decision rule** (bonus plan §1/§6/§7 R-7): pick E4B as final #2 iff its best public score ≥ 0.03 (≈2 tasks) **and** the main-track #2 candidate is not within noise of #1’s robustness — otherwise spend both slots on main-track hedges.

---

*Anchors: `01-bcf-formal-specification.md` §3–§7, §9–§10; `02-kaggle-whitepaper-draft.md` §2–§5, §7; `04-bonus-prize-submission-plan.md` §1, §3–§4, §6–§7; `05-main-idea-beginners-guide.md` §2.2–§2.3; intel register 745731, 747519, 748287, 749528, 750974, 751707, 752017, 752128, 752220, 752239, 753277, 753388, 753524, 753793, 751104. Full list in `09-sources.md`.*

### F8. Impact-effort analysis and roadmap

*Attached in full, as written on 2026-11-24. Its own title: “Task 6 - Impact-effort analysis and roadmap: which levers to pull, with which values, in which order.”*

**Prepared:** 2026-11-24, 22:40 UTC. **Horizon:** the final deadline, 2026-12-02 23:59 UTC, with the notebook-publish freeze at 2026-11-25 23:59 UTC. **Inputs:** Tasks 1 to 5 of this package. **Rule of the roadmap:** the private leaderboard is one draw of each of two selected submissions, so the objective is the mean and the spread of a single run, not the best public score.

---

##### 1. What "return" means here

Three quantities move the final ranking, and each lever is scored against them:

| Quantity | What it is | Why it matters | How it is measured before submitting |
| --- | --- | --- | --- |
| Mean resolved count | Tasks a single run resolves on average | The private score is a single run | Paired panel runs, three per bundle (Task 4) |
| All-or-nothing risk | The probability that the run exceeds 12 hours, fails to start, or scores 0.00 | One failure erases the mean | Projected mean seconds per task; the official compiler; the result size after scoring |
| Spread | The standard deviation of a single run | Among equal means, the smaller spread wins more often | Paired runs: count of tasks that flip |

Effort is the working time to make the change and validate it at the cheapest tier that can decide it. Both scales run from 1 to 5.

---

##### 2. The ranked list

| Rank | Lever and the value to set | Impact | Effort | Return (impact over effort) | Evidence | Tier that decides it |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 1 | **Use the patched brain** (`bcf-brain-patched/`): the six fixes of Task 5 are already made and validated | 4 (two of them prevent losing a correct fix) | 1 | 4.0 | Executed probe: 5 gaps to 0; routing 43% to 75% on category | T0, T1 (done), T2 |
| 2 | **Solver thinking budget 4,096 to 2,048** on the 31B bundles (`build.py`, `SAMPLING[("31b","solver")]`) | 5 on time, neutral to positive on solves (hypothesis) | 1 | 3.0 | Board: 4,096 and 1,024 tied on solves for the small model; 4,096 is 164 to 241 s on the scorer | T3 paired |
| 3 | **Governor gates**: `T_EDIT_S` 150 to 110, `T_VERIFY_S` 300 to 230, `FREEZE_FRAC` 0.78 to 0.68, `HARD_FRAC` 0.90 to 0.82 | 4 on time and spread | 1 | 3.0 | Board: first edit at 106 s in solved runs against 183 s in failed ones | T3 paired, with projection |
| 4 | **Measure the mean task time once** (smoke panel, 5 tasks, with the trace extractor of Task 4) | 5 on risk: it decides whether lever 5 is needed | 1 | 3.0 | Arithmetic: 360 s per task at 120 tasks | T2 |
| 5 | **Per-task cap**: keep `max_time_minutes` 8 unless the projected mean exceeds 300 s, then 7, then 6; `max_turns` 80 to 56; `timeout_seconds` 240 to 120 | 5 on the all-or-nothing risk | 1 | 2.5 | Board: 15 minutes and 50 calls exceeded 12 hours; 28 calls is the cliff | T2 and T3 |
| 6 | **Routing and hints**: keep the patched rule; add the three hint sentences of Task 1, section 6, row 5 (coroutine detection in the DI hint, pickling in OBJ, broken pipe in CON, warnings in the solver core) | 3 on mean | 1 | 2.0 | Task 1 | T1 (routing measured), T3 |
| 7 | **Solver prompt from 5.6 KB to at most 3 KB** on the 31B track | 3 on mean, 4 on spread | 2 | 1.8 | Board: lean prompts win; elaborate decks scored 0.06 to 0.08 | T2, T3 paired |
| 8 | **E4B thinking 1,024 against 0 and 512** (`SAMPLING[("e4b","solver")]`), planner thinking 0 | 3 on the bonus track | 1 | 2.0 | Board: zero-think beat 4,096 by 16 to 10 on 114 tasks; 1,024 and 4,096 tied | T3 paired on E4B |
| 9 | **Drop `read_file` from the solver** (the helper reads) | 2 on malformed calls | 1 | 1.5 | Hypothesis; board evidence is about multi-argument tools in general | T3 |
| 10 | **Planner thinking 1,024 to 0** (relay bundles only) | 2 on time | 1 | 1.5 | Hypothesis H5 | T2, T3 |
| 11 | **Repeated failed block recognised** (about fifteen lines in `cmd_apply`) | 2 on calls saved | 2 | 1.0 | Board: 75% of failed edit calls repeat an earlier failure | T1, T3 |
| 12 | **Helper `status` without `git status` and recompilation outside the freeze** | 2 on time | 2 | 1.0 | Source: `status` calls `_check()` on every call | T1 |
| 13 | **Localizer: one indexed scan with a cached file list** | 3 on mean, 2 on time | 3 | 1.0 | Measured: top-9 file 96 of 129; three scans of the tree today | T1 (`eval_localizer.py`) |
| 14 | **Output cap 8,192 to 6,144** on 31B only | 2 on time | 1 | 1.0 | Board: a smaller cap doubled edit errors for the small model | T3 |
| 15 | **Temperature 0.2 to 0.0 and a fixed seed** | 2 on spread | 1 | 1.0 | Weak: temperature 0 is not deterministic for agents | T3 |
| 16 | **Three paired runs of the two finalists** and the projection check | 4 on the quality of the final choice | 2 | 1.5 | Task 4, section 6 | T3 |
| 17 | **One parity run on Kaggle L4x4** of the finalist | 3 on confidence in time | 3 | 0.7 | Notebook tier: the staff harness on the scorer's GPUs | T4 |
| — | LoRA | negative by default | 5 | below 0 | Board: minus 7 tasks for a zero-weight adapter | not attempted |

---

##### 3. The values, in one table

| Setting | File | 31B today | 31B, step 1 | 31B, step 2 (only if the projected mean is above 300 s) | E4B today | E4B, step 1 |
| --- | --- | --- | --- | --- | --- | --- |
| `thinking_budget`, solver | `build.py` `SAMPLING` | 4096 | 2048 | 1024 if step 1 lost nothing | 1024 | 0 and 512, in a paired run |
| `max_output_tokens`, solver | `build.py` | 8192 | 8192 | 6144 | 8192 | 8192 |
| `temperature`, solver | `build.py` | 0.2 | 0.2 | 0.0 with a seed | 0.2 | 0.2 |
| `thinking_budget`, planner | `build.py` | 1024 | 0 | 0 | 256 | 0 |
| `max_time_minutes` | `build.py` `EVAL` and `BUDGET_S` | 8 | 8 | 7, then 6 | 8 | 8 |
| `max_tool_calls` | `build.py` `EVAL` | 28 | 28 | 26 | 28 | 28 |
| `max_turns` | `build.py` `EVAL` | 80 | 56 | 48 | 80 | 56 |
| `timeout_seconds` | `build.py` `EVAL` | 240 | 240 | 120 | 240 | 240 |
| `T_EDIT_S` | `parts/_bcf_head.py` | 150 | 110 | 100 | 150 | 120 |
| `T_VERIFY_S` | `parts/_bcf_head.py` | 300 | 230 | 210 | 300 | 240 |
| `FREEZE_FRAC` | `parts/_bcf_head.py` | 0.78 | 0.68 | 0.65 | 0.78 | 0.70 |
| `HARD_FRAC` | `parts/_bcf_head.py` | 0.90 | 0.82 | 0.80 | 0.90 | 0.84 |
| `CMD_TIMEOUT_S`, `REPRO_TIMEOUT_S` | `parts/_bcf_head.py` | 45, 40 | 35, 25 | 35, 25 | 45, 40 | 35, 25 |
| Solver tools | `build.py` | 4 tools | 4 tools | 3 tools (drop `read_file`) | 4 tools | 4 tools |
| Solver instruction | `src/prompts/` | 5,585 characters (relay), 6,524 (flat) | at most 3,000 | same | 2,799 and 3,141 | same |

`BUDGET_S` must equal `max_time_minutes` times 60; the build stops when they disagree. After any change to `parts/`: `python assemble.py`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py`.

---

##### 4. The calendar

Seven submission days remain (2026-11-25 to 2026-12-01); the last safe morning is 2026-12-01.

| Day (UTC) | Local work | Submission | Gate to pass before submitting |
| --- | --- | --- | --- |
| Nov 25 | Smoke run of the patched `bcf-31b-flat` (5 tasks): per-call seconds and tokens; write the projection factor | `bcf-31b-flat` (patched), early in the day. It banks a score and answers whether skill scripts run on the scorer | Compiler 6 of 6, controls 15 of 15, smoke run clean on 5 tasks |
| Nov 26 | Thinking 2,048 and the new gates: three paired runs against the baseline on the ranking panel | Nothing | Paired table: not fewer resolved, lower projected mean |
| Nov 27 | Prompt trim to 3 KB; drop `read_file`; hint sentences | The improved 31B bundle if Nov 26 passed its gate | Paired table; malformed calls per 100 |
| Nov 28 | E4B: thinking 0 and 512 against 1,024, paired | `bcf-e4b-flat` once (bonus eligibility needs one E4B submission among the two finals) | E4B smoke run; compiler |
| Nov 29 | Three paired runs of the two best 31B bundles; read the result sizes and hours-to-score of every attempt so far | Nothing | Ledger complete |
| Nov 30 | Choose the two finalists by local mean; optional L4x4 parity run of the finalist | A confirmation run of finalist 1 only if its last score was abnormal | Result size normal |
| Dec 1 | Nothing new | Last safe morning for a submission; select the two finals | Selection done |
| Dec 2 | Nothing new | Deadline 23:59 UTC | |

Publish any notebook version you may still need before the freeze at 2026-11-25 23:59 UTC (board thread 759388 asked whether private versions can still be submitted after it; unanswered).

---

##### 5. Decision gates

| Question | Rule |
| --- | --- |
| Is a change better? | Adopt when the paired table shows more tasks gained than lost and the projected mean time is not worse; reject when tasks are lost with no gain; otherwise run more pairs |
| Is the bundle safe to submit? | Compiler 6 of 6, 15 controls rejected, one smoke run clean, the bundle's SHA-256 written in the ledger |
| Is the run inside the clock? | Projected hours for 120 tasks at or below 10.8; otherwise lower the cap one step before submitting |
| Is a scored result a draw or a fault? | Hours to score in the normal band and a result size of 60 to 130 KB: a draw. About 3,230 bytes: a fault; resubmit the same file |
| Which two finals? | The two bundles with the best local mean over paired runs; the public score breaks ties only |

---

##### 6. What not to spend time on

| Temptation | Why not |
| --- | --- |
| A LoRA adapter | No demonstrated gain; a measured cost in time and a risk to the thinking channel; eight days are not enough to beat the cost |
| A second model or a mixed bundle | Not allowed: one base model per submission |
| The E2B checkpoint | Reported to fail to load on the pinned stack |
| Graph tools | No measured gain and one list-argument tool |
| A bigger thinking budget | 4,096 is already 164 to 241 seconds on the scorer |
| Tuning against public-score differences below 0.07 | Inside the noise of a single run |
| The 29 ungradable and 2 unsatisfiable public tasks | They add noise to every panel |

---

##### 7. Sources

This document applies the measurements of Tasks 1 to 5. The evidence behind each lever is in `02_Time_Bottlenecks_and_Tuning_Levers.md` (Part B), the validation of the patched brain in `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md`, the noise arithmetic and power tables in `04_Local_Scoring_and_Interpretation_Guide.md` (section 6), and the deadline facts in the Overview page of the competition (fetched 2026-11-24).

### F9. Playbook 1: install everything on Zorin OS 18

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 1. Install everything on Zorin OS 18.”*

**Goal:** a machine on which the brain can be run on the test sets. You do each step once. **Written for:** a beginner on the PowerSpec G914 (RTX 5090) who keeps Windows on the same disk.

##### Read this first

| Item | Statement |
| --- | --- |
| What you will have at the end | Zorin OS 18.1 with the NVIDIA driver; the FreshSWE-Py data set (7 GB); the model (17 to 18 GB); two small Python environments, one for the model server and one for the harness; Docker with the sandbox image; the brain, built and tested; and this playbook, checked |
| Time | 2 to 4 hours the first time, most of it downloads (about 45 GB in total: the model, the two environments, the data set) |
| What was executed for this playbook | The Zorin pages were read; the package lists were resolved; the harness environment was built and tested on Windows. The steps below were **not run on a Zorin machine**: each block of commands says "not run here" in the table at the end |
| The three things that break everything if skipped | Python must be exactly 3.12.13 in both environments; the harness lives in its **own** environment (`~/.venv-harness`), the model server in another (`~/.venv`); the FreshSWE-Py release folder must be unpacked whole, because the sandbox image is built from it |
| Where the commands come from | The setup guide of the 2026-11-24 package (`07_Setup_and_Run_Guide.md`, sections 3 and 5), the FreshSWE-Py README, the official Zorin help pages. This playbook adds what that guide lacks: a second environment and the harness dependencies (steps 8 and 12) |

How to read a step: each has **Type**, the lines to copy into the terminal, one block at a time; **Expect**, what the last line should look like; and sometimes **If not**, where to look. A line that starts with `#` is a comment: you need not type it.

##### Step 1. Install Zorin OS 18.1 next to Windows

1. On any computer, download **Zorin OS 18.1 Core** (free) from `https://zorin.com/os/download`. The Core edition is enough.
2. You need a USB stick of 4 GB or more for the Core edition. Everything on the stick is erased.
3. Write the downloaded `.iso` file to the stick with **balenaEtcher** (from `etcher.balena.io`): "Flash from file", choose the `.iso`; "Select target", choose the stick; "Flash!". On Windows, Rufus works too.
4. Shut the G914 down completely. Plug the stick in. Switch on and press the boot-menu key repeatedly (usually `Esc`, `Delete`, `F2` or `F12`); choose the entry that mentions "USB" or "EFI".
5. In the Zorin boot menu select **Try or install Zorin OS (modern NVIDIA drivers)** and press Enter. This option installs the official NVIDIA driver, version 580, during the installation. Do not skip the check of the USB stick the first time.
6. In the installer, connect to the Internet. At **Updates and other software**, make sure **Install third-party software for graphics and Wi-Fi hardware and additional media formats** is switched on.
7. At **Installation type**, choose **Install Zorin OS alongside Windows** and give Zorin at least 150 GB (the model, the data and the environments need about 60 GB; results take more). If the option does not appear because the machine has several internal drives, choose **Something else** and follow Zorin's manual partitioning guide (link at the end of Zorin's install page).
8. Create your user name and password, finish, restart, and remove the stick. At start-up you choose between Windows and Zorin.

> If the NVIDIA driver is not active after the first login: Zorin Menu, System Tools, Software Updater, Settings, tab **Additional Drivers**: select the newest standard **NVIDIA driver** marked "(proprietary)", Apply Changes, restart. If it still is not active, Zorin's guide says Secure Boot may block it: restart, enter the BIOS or UEFI settings (the same key as for the boot menu), open the **Boot** or **Security** tab, switch **Secure Boot** off, save and exit (usually `F10`).

##### Step 2. First login: updates, a terminal, the driver

Open the **Zorin Menu** (the button at the bottom of the screen), type **Software Updater**, press Enter, install the updates, and restart if it asks. Then open a terminal: Zorin Menu, type **terminal**, Enter.

**Type** (the shortcut `Ctrl+Shift+V` pastes into the terminal, or right-click and Paste):

```bash
nvidia-smi
```

**Expect:** a table with `NVIDIA GeForce RTX 5090` and `Driver Version: 580.xx` or later. (On the machine this playbook was written on it prints a GTX 1060 with 582.66, which is why the tools only ask for 580 or later.) If `nvidia-smi` is not found, do the block quote of step 1.

##### Step 3. The base tools, `uv`, and Python 3.12.13

`uv` installs Python and Python packages; everything else in this playbook uses it.

**Type** (not run here):

```bash
sudo apt update
sudo apt install -y git curl unzip pigz patch protobuf-compiler build-essential pandoc
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv --version
uv python install 3.12.13
uv python list | grep 3.12.13
```

**Expect:** a version number from `uv --version`, and a line with `cpython-3.12.13` from the last command. `pandoc` is only needed if you want to rebuild the HTML guide yourself.

##### Step 4. The working folder, and the files from Windows

**Type** (not run here):

```bash
mkdir -p ~/bcf/from-windows ~/bcf/data ~/bcf/models ~/bcf/results ~/bcf/env ~/bcf/tools
```

Copy two folders from the Windows disk into `~/bcf/from-windows`. In Zorin's **Files** app, open **Other Locations** in the left bar, then the Windows drive (D:), and go to `stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/deliverables`. If Windows asks for a BitLocker recovery key, enter it. The two folders:

| Folder on Windows | What it holds |
| --- | --- |
| `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity` | The brain (`bcf-brain-patched`) and the panel runner (`tools/run_panel.py`) |
| `2026-11-25_BCF_Test_Sets_Playbook` | This playbook |

Then put them where the playbook expects them (not run here):

```bash
cp -r ~/bcf/from-windows/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/bcf-brain-patched/. ~/bcf/brain/
cp -r ~/bcf/from-windows/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/tools/. ~/bcf/tools/
mv ~/bcf/from-windows/2026-11-25_BCF_Test_Sets_Playbook ~/bcf/playbook
ls ~/bcf/brain ~/bcf/tools ~/bcf/playbook
```

**Expect:** `agent.yaml`-style build files under `brain` (`build.py`, `parts`, `src`, `tools`, `tests`), `run_panel.py` under `tools`, and `playbook.conf` and `sets` under `playbook`. Work only inside your home folder, never directly on the Windows partition: Linux runs faster and keeps the file permissions.

> If the two machines are not the same: copy the two folders with a USB stick instead; nothing else changes.

##### Step 5. The competition wheelhouse

The wheelhouse is Kaggle's set of 41 pinned Python packages for this competition (881 MB): the harness and the serving stack.

**Type** (not run here):

```bash
mkdir -p ~/bcf/wheelhouse && cd ~/bcf/wheelhouse
curl -L -o wheelhouse.zip https://www.kaggle.com/api/v1/datasets/download/metric/gemma-4-developer-agent-wheelhouse
unzip -q wheelhouse.zip && rm wheelhouse.zip
ls *.whl | wc -l
```

**Expect:** `41`.

##### Step 6. Kaggle, and the FreshSWE-Py data set

The test sets are tasks of **FreshSWE-Py**, a public Kaggle data set (6.97 GB to download, 6.6 GB unpacked). Downloading needs a Kaggle account and its token file.

1. On `https://www.kaggle.com/settings`, under API, choose **Create New Token**. Your browser saves a file `kaggle.json`. Move it into the folder `~/.kaggle` on Zorin (in Files, press `Ctrl+L`, type `~/.kaggle` and Enter; create the folder if it does not exist).
2. Never show this file to anyone and never paste it into a chat; the tools of this playbook only check that it exists.

**Type** (not run here):

```bash
mkdir -p ~/.kaggle && chmod 700 ~/.kaggle && chmod 600 ~/.kaggle/kaggle.json
uv tool install kaggle
mkdir -p ~/bcf/data && cd ~/bcf/data
kaggle datasets download -d moshegolderson/freshswe-py
unzip -q freshswe-py.zip -d freshswe-py && rm freshswe-py.zip
ls freshswe-py
```

**Expect:** the download (several minutes), then the list `baselines  docker  embeddings  graphs  locks  README.md  sandbox  snapshots  splits.json  tasks.jsonl  validation  wheelhouse`.

##### Step 7. The environment of the model server

The model server is vLLM, served from the RTX 5090. It has its own environment, `~/.venv`, exactly as in the setup guide of the 2026-11-24 package.

**Type** (not run here):

```bash
cd ~/bcf
uv venv --python 3.12.13 .venv && source .venv/bin/activate
uv pip install torch==2.10.0+cu128 torchaudio==2.10.0+cu128 torchvision==0.25.0+cu128 --index-url https://download.pytorch.org/whl/cu128
uv pip install vllm==0.19.1
cp ~/bcf/tools/install-wheelhouse.sh ~/bcf/ && bash ~/bcf/install-wheelhouse.sh ~/bcf/wheelhouse
python -c "import torch, vllm; print(torch.__version__, torch.cuda.get_device_capability(), vllm.__version__)"
deactivate
```

**Expect:** from the script, `wheelhouse installed: ... wheels (cutlass skipped)`; from the last line, `2.10.0+cu128 (12, 0) 0.19.1`.

**If not:** `CUDA error: no kernel image is available` means PyTorch was installed from the wrong place: remove the folder `~/.venv` and repeat the step from `uv venv`.

> The install script also prints whether `swegemma` can be imported. In this environment it is expected to print `NOT IMPORTABLE` for `swegemma`, `adk_submission` and `google.adk`: the harness lives in the next environment. That is the one place where this playbook differs from the 2026-11-24 guide, which put both in one environment. The reason is in step 8.

##### Step 8. The environment of the harness

The harness (`swegemma`) runs the brain on a task and grades the patch. Its packages and the model server's packages want different versions of the same library: vLLM 0.19.1 needs `starlette` 1.0 or later and `mcp` 2, google-adk 1.36.1 (which the harness needs) asks for `starlette` below 1.0 and `mcp` below 2. One environment cannot hold both; two can. The harness environment needs no PyTorch at all.

**Type** (not run here):

```bash
cd ~/bcf
uv venv --python 3.12.13 .venv-harness
source .venv-harness/bin/activate
uv pip install --no-deps ~/bcf/wheelhouse/swegemma-*.whl ~/bcf/wheelhouse/adk_submission-*.whl ~/bcf/wheelhouse/adk_eval_core-*.whl ~/bcf/wheelhouse/google_adk-*.whl
deactivate
```

**Expect:** `uv` lists the four packages: `adk-eval-core 0.1.0`, `adk-submission 0.2.13`, `google-adk 1.36.1`, `swegemma 0.2.11`.

##### Step 9. The model weights

**Type** (not run here):

```bash
source ~/bcf/.venv/bin/activate
uv pip install "huggingface_hub[cli]"
mkdir -p ~/bcf/models
huggingface-cli download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
deactivate
```

**Expect:** 17 to 18 GB, then a line `.../gemma-4-31b-it-qat-w4a16-ct` with the folder path. The repository is public and not gated (checked on the Hugging Face API on 2026-11-25), so no login is needed. The repository name uses capital letters (`31B`); the folder name is yours, and what matters is the `--served-model-name` of Playbook 2.

##### Step 10. Docker and the sandbox image

The agent works inside a sandbox: a Docker image built from the FreshSWE-Py release. It holds the Python 3.13 of the scorer and every package the tasks need, offline.

**Type** (not run here):

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Log out and in again (so that your user may use Docker), open a terminal, then (not run here):

```bash
docker run --rm hello-world
cd ~/bcf/data/freshswe-py && docker build -t freshswe-sandbox:latest -f docker/Dockerfile .
docker run --rm freshswe-sandbox:latest python --version
```

**Expect:** `Hello from Docker!`; a build that takes several minutes (it installs packages from the network once); then `Python 3.13.x`. The NVIDIA Container Toolkit is not needed: the sandbox uses no GPU. Docker's own documentation does not list Zorin as a supported distribution; the Ubuntu 24.04 ("noble") repository is the one for it, as Zorin 18 is built on Ubuntu 24.04.

##### Step 11. The brain

**Type** (not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/brain && python build.py && python -m unittest tests.test_bcf
ls dist
deactivate
```

**Expect:** the tests take about 90 seconds and end with `OK` (36 pass, 1 skipped on 2026-11-24); `dist` holds six bundles, among them `bcf-31b-flat`, the one this playbook runs.

##### Step 12. Finish the harness environment

The wheelhouse brings the four harness packages but not what they import (`docker`, `litellm` and about 150 others). `finish_env.py` installs them from a list resolved once with uv (155 packages, the wheelhouse's versions kept), each on its own, and then imports every module the harness uses to prove nothing is missing.

**Type** (not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/playbook
python tools/finish_env.py --dry-run
python tools/finish_env.py
```

**Expect:** the dry run lists about 150 packages under "would install"; the real run ends with `Every probed module imports. Next: the acceptance checks` after about 4 minutes (on Windows it took 223 seconds). The list of what it added is in `~/bcf/env/harness-deps.txt`.

##### Step 13. The acceptance checks

**Type** (not run here):

```bash
cd ~/bcf/playbook
python3 tools/selftest.py
python3 tools/check_setup.py
```

**Expect:** `21 of 21 tests passed` from the self-test. From the checks: `PASS` on System, NVIDIA driver, Harness Python, Harness ready (pre-flight), Server Python (torch), FreshSWE-Py, Docker and sandbox image, The sets and their parts, Disk, Kaggle token file; and `TODO` on exactly two rows, Model server and Gate on P20, which Playbook 2 does.

**If not:** each failed row names the step to repeat; `07_Playbook_Troubleshooting.md` has the rest.

##### The checklist of Playbook 1

- [ ] Step 1: Zorin OS 18.1 installed next to Windows
- [ ] Step 2: `nvidia-smi` shows driver 580 or later
- [ ] Step 3: `uv` works and Python 3.12.13 is installed
- [ ] Step 4: `~/bcf/brain`, `~/bcf/tools` and `~/bcf/playbook` exist
- [ ] Step 5: 41 wheels in `~/bcf/wheelhouse`
- [ ] Step 6: `~/bcf/data/freshswe-py/tasks.jsonl` exists
- [ ] Step 7: the server environment prints `2.10.0+cu128 (12, 0) 0.19.1`
- [ ] Step 8: the harness environment holds the four harness packages
- [ ] Step 9: the model is in `~/bcf/models`
- [ ] Step 10: `docker run --rm freshswe-sandbox:latest python --version` prints 3.13
- [ ] Step 11: the brain's tests end with `OK`
- [ ] Step 12: `finish_env.py` ends with "Every probed module imports"
- [ ] Step 13: `check_setup.py` shows no `FAIL`, and `TODO` on Model server and Gate only

##### What was not run here, step by step

| Step | Status |
| --- | --- |
| 1 to 11 | Written from the official Zorin help pages, the 2026-11-24 setup guide and the FreshSWE-Py README; not executed on a Zorin machine |
| 12 | The same recipe was executed on Windows in a new environment: the four wheels, then the lock (151 packages), then the probe; the pre-flight of the panel runner passed there. Not executed on Zorin |
| 13 | `selftest.py` and `check_setup.py` were executed on Windows (the checks correctly report what this Windows machine lacks); not on Zorin |

### F10. Playbook 2: first run, the gate, the model server, the first tasks

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 2. First run: the gate, the model server, the first tasks.”*

**Goal:** prove that the machine measures the brain and not a broken environment, then run the first tasks. After this playbook you have a first complete run of P20 to compare against.

| Item | Statement |
| --- | --- |
| Time | About 1 to 2 hours: the gate (minutes, not measured here), the first start of the model server (it compiles its kernels the first time), then about 1 hour 30 minutes for the full run of P20 if you do step 8 the same day |
| What was executed for this playbook | `gates.py --selfcheck` and the pre-flight of the runner, on Windows, in the harness environment built by Playbook 1. The gate, the model server and the agent runs were **not run here**: they need the GPU, Linux and the data set |
| The rule of this playbook | Never run the brain on a set before its gate has passed in the same sandbox image |

Every command below is typed in the terminal on Zorin unless stated otherwise. Start every session with:

```bash
source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook
```

##### Step 1. Tell the tools where things are

`playbook.conf` holds the paths. The values it ships with are the ones Playbook 1 creates, so most people change nothing. If you put something somewhere else, edit the file (Zorin Menu, type **Text Editor**, open the file) and check:

**Type** (executed here on Windows; on this machine it lists the parts and then reports what is not installed):

```bash
python3 tools/run_set.py --list
python3 tools/run_set.py --set P20 --part smoke_1 --version v1 --dry-run
```

**Expect:** a table of the six sets and their parts; then eleven lines starting with `ok`, among them `ok    task file .../freshswe-py/tasks.jsonl` and `ok    all 1 tasks of the list are in the task file`, and the command it would run. A line starting with `FAIL` names a path: fix it in `playbook.conf`.

##### Step 2. The gate

The gate proves two things about each task in the sandbox the agent will use: that the reference fix of the task passes the hidden tests, and that no patch at all does not. It uses the harness's own grader with the scorer's rules, and it calls no model, so the model server need not run.

**Type** (not run here):

```bash
python3 tools/gates.py --selfcheck
python3 tools/gates.py --set P20 --part full
```

**Expect:** from the self-check, `The harness in this interpreter has everything gates.py uses.` (this line was produced on Windows). From the gate, two progress blocks ("Gate 1 of 2", "Gate 2 of 2") and then:

```text
reference fix resolves 20 of 20 (expected 20) | no patch resolves 0 (expected 0) | keep 20 of 20
Every task passed both gates. The list for the agent run is sets/P20/full.txt.
```

The report is in `~/bcf/results/gates/P20-full/gates.md`, one line per task.

**If not:** a task whose reference fix does not resolve points at the environment: read the row's reason in `gates.md` and the entry in Playbook 7. A task that an empty patch resolves measures nothing. Drop such tasks only after the environment is fixed and the gate is run again; a gate report is never overwritten, so remove its folder to run again.

Repeat for every other set the first time you use it (`--set R1`, `R2`, `R3`, `R4`, each with `--part full`), and for B40 before its confirmation run. You can do this now or later.

##### Step 3. Start the model server

The server is a program that loads the model into the RTX 5090 and answers the harness. It runs in **its own terminal** and in the environment of the model server, and it must keep running for every agent run. Open a second terminal (Zorin Menu, Terminal again).

**Type in the second terminal** (not run here; the settings are those of the staff Getting Started notebook, as in the 2026-11-24 setup guide):

```bash
source ~/bcf/.venv/bin/activate
export HF_HOME=~/bcf/hf TRANSFORMERS_OFFLINE=1 TRANSFORMERS_NO_TF=1 TRANSFORMERS_NO_FLAX=1 \
       VLLM_NO_USAGE_STATS=1 VLLM_WORKER_MULTIPROC_METHOD=spawn VLLM_ENGINE_READY_TIMEOUT_S=1200 \
       VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
       NCCL_DEBUG=WARN LITELLM_LOCAL_MODEL_COST_MAP=True LITELLM_TELEMETRY=False OTEL_SDK_DISABLED=true
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  > ~/bcf/vllm-31b.log 2>&1 &
tail -f ~/bcf/vllm-31b.log
```

**Expect:** a stream of log lines that ends with one saying the server started, on `http://127.0.0.1:8000`. The first start takes long: it compiles kernels for the GPU. Then press `Ctrl+C` to leave the log (the server keeps running in the background) and check from the first terminal:

```bash
curl -s http://127.0.0.1:8000/v1/models
```

**Expect:** a small JSON text that contains `"gemma-4-31b-it-qat-w4a16-ct"`. That name must be exactly the `model:` line of the bundle (`gemma-4-31b-it-qat-w4a16-ct` in `dist/bcf-31b-flat/agent.yaml`): the runner refuses to start otherwise.

**If not:** read the last 50 lines of the log (`tail -n 50 ~/bcf/vllm-31b.log`) and look the message up in Playbook 7.

##### Step 4. The acceptance checks, again

**Type** (not run here):

```bash
python3 tools/check_setup.py
```

**Expect:** no `FAIL`; `PASS` on Model server; `TODO` only on Gate on P20 if you have not run it yet. The message ends with `The machine is ready for the first agent run.`

##### Step 5. The first task

**Type** (not run here):

```bash
python3 tools/run_set.py --set P20 --part smoke_1 --version v1
```

**Expect:** the eleven checks (`ok`), the command, then the first line printed by the runner:

```text
model gemma-4-31b-it-qat-w4a16-ct | sandbox docker | concurrency 1 | eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s | compaction at 14,336 tokens | tasks: 1
```

and after 5 to 8 minutes `Evaluation complete: .../1 resolved`, then `Exit code 0` and the path of the results.

| Look at | Expect | If not |
| --- | --- | --- |
| The runner's first line | `eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s` | Another budget: the wrong bundle folder in `playbook.conf` |
| `~/bcf/results/P20/smoke_1/v1-run1/summary.json` | `"total_tasks": 1` and a `resolved` count of 0 or 1 | `"errors": 1`: open `task_results.jsonl`, the `error` field says why |
| The folder `logs` of the results | One log of the agent's calls: the installer, `plan`, `find`, `apply`, a test, `finalize` | `No module named` or `command not found`: the sandbox image is wrong (Playbook 7) |
| The server terminal's log | Requests arriving, no errors | Connection errors: the server stopped; read its last lines |

The task `click_3434` was solved by both published baseline agents, so a healthy run usually resolves it; a run that ends with a patch and a clear test result is a success even when it is not resolved.

##### Step 6. Three tasks

**Type** (not run here):

```bash
python3 tools/run_set.py --set P20 --part smoke_3 --version v1
```

**Expect:** the same, with `tasks: 3`: about 15 to 25 minutes. The three tasks are one that both baselines solved (`click_3434`), one that only one solved (`click_3208`) and one that neither solved (`click_3211`), so that you see the three kinds of outcome. Open the log of the task that was not solved and follow what the agent did; that is the skill every later playbook uses.

##### Step 7. The same version twice, on five tasks

Before comparing two versions, see how much two runs of the **same** version differ. That difference is the noise, and a change has to be larger than that to count.

**Type** (not run here; each command about 25 minutes at the scorer's pace, up to 40 at the limit):

```bash
python3 tools/run_set.py --set P20 --part slice_A --version v1
python3 tools/run_set.py --set P20 --part slice_A --version v1
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v1-run2 --name v1 v1
```

**Expect:** the second `run_set.py` writes `v1-run2` (a run is never overwritten); `compare.py` prints five tables and, under "What it means", that 5 pairs are a loop result.

##### Step 8. The first complete run of P20

**Type** (not run here; about 1 hour 30 minutes at the scorer's pace, 2 hours 40 minutes at the 8-minute limit):

```bash
python3 tools/run_set.py --set P20 --part full --version v1
python3 tools/ledger.py
```

**Expect:** `tasks: 20`; then the ledger, `LEDGER.md` in the playbook folder, with one line per run so far. This run is the first measurement of version `v1`; Playbook 5 repeats it.

##### Step 9. Stop the server

In the terminal where the server runs, or any terminal:

```bash
pkill -f "vllm serve"
```

Then `nvidia-smi` should list no process. Start it again with Step 3 whenever you run the brain.

##### The checklist of Playbook 2

- [ ] Step 1: `run_set.py --dry-run` prints eleven lines with `ok`
- [ ] Step 2: the gate on P20 keeps 20 of 20
- [ ] Step 3: `curl` shows the model name of the bundle
- [ ] Step 4: `check_setup.py` ends with "The machine is ready for the first agent run."
- [ ] Step 5: one task ran end to end without a harness error
- [ ] Step 6: three tasks ran; you read one log
- [ ] Step 7: two runs of the same version on `slice_A`, compared
- [ ] Step 8: one complete run of P20, in `LEDGER.md`

### F11. Playbook 3: the test sets, what they are and which one to use

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 3. The test sets: what they are and which one to use.”*

**Goal:** know what P20, B40 and R1 to R4 are, where they come from and what each is for.

##### 1. One task

A task is one real bug in one open-source Python repository, turned into a row in the competition's format. The row holds what the Kaggle scorer uses:

| Field | Content |
| --- | --- |
| `instance_id` | The name of the task: repository and number, for example `click_3434` |
| `repo`, `base_commit` | The repository and the commit before the fix; the sandbox starts from it |
| `problem_statement` | The text the agent reads: the issue, or the description of the pull request |
| `patch` | The reference fix, written by the maintainers |
| `test_patch` | The hidden tests: they fail before the fix and pass after it |
| `created_at` | When the fix was merged |

The FreshSWE-Py data set adds fields of its own that the scorer ignores, among them which baseline agents solved the task and where the statement came from. This playbook uses those two to cut the sets.

##### 2. The six sets

All tasks come from one public data set, **FreshSWE-Py** (663 validated tasks from 33 repositories, all created in April 2026 or later, after the Gemma 4 model was released). The portfolio package of 2026-11-25 selected the sets from it.

| Set | Tasks | Repositories | Statement sources | Solved by both baselines | By one | By neither | Created from | Created to |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P20 | 20 | 3 (`packaging` 8, `click` 6, `more-itertools` 6) | 13 closed issues, 6 pull requests, 1 changelog | 9 | 7 | 4 | 2026-04-08 | 2026-09-18 |
| R1 | 20 | 15 | 11, 7, 2 | 9 | 7 | 4 | 2026-04-10 | 2026-10-17 |
| R2 | 20 | 18 | 10, 9, 1 | 9 | 7 | 4 | 2026-04-02 | 2026-10-15 |
| R3 | 20 | 17 | 10, 9, 1 | 9 | 7 | 4 | 2026-05-26 | 2026-10-17 |
| R4 | 20 | 18 | 10, 8, 2 | 9 | 7 | 4 | 2026-04-05 | 2026-10-03 |
| B40 | 40 | 3 (the ones of P20) | 11 closed issues, 29 pull requests | 14 | 10 | 16 | 2026-04-05 | 2026-09-21 |

No task is in two sets. The 26 repositories of R1 to R4 are not among the three of P20 and B40, and none of the 29 is one of the four public repositories of the competition (FastAPI, rich and Requests are three of them): by a statement of the organizers, the scored tasks all come from repositories that are in neither, so a set of other repositories is the right instrument.

##### 3. What "solved by both, one, neither" means

FreshSWE-Py was published with the results of two reference agents on every task: the author's own tuned agent (two runs) and the organizers' reference agent (one run). For every task that gives:

| Group | Tasks in a set of 20 | What a task of the group is good for |
| --- | --- | --- |
| Both baseline agents solved it | 9 | The core: a healthy brain solves most of them; a change that loses one of them is a regression |
| One baseline agent solved it | 7 | The margin: these tasks separate a good change from noise, because they are solvable but not easily |
| Neither baseline agent solved it | 4 | The stretch: rarely solved; a change that solves one is worth a look, and one that never solves any is normal |

A set built any other way would be easier to pass by accident: a set of 20 easy tasks is solved 20 to 18 by every version, a set of 20 hard ones 0 to 2. The mix 9 : 7 : 4 is the same in P20 and in each of R1 to R4, so a score means the same thing on every set.

##### 4. What each set is for

| Set | Use it for | Do not use it for |
| --- | --- | --- |
| P20 | Learning how the brain behaves task by task; the first comparison of any change; the loops (cut into parts, Playbook 4) | The final word on a change you tuned on it |
| R1 to R4 | Each new comparison of the same line of work on a new set; seeing whether a change holds on other kinds of repository | Learning the tasks line by line: that is what P20 is for |
| B40 | One confirmation run of the version you are about to keep, against the one it replaces | Any loop, any tuning: once a set has been used to shape a change, it can no longer judge that change |

The rule behind the table: a set measures a change fairly only if the change was not shaped by that set's tasks.

##### 5. The files

| File | Content |
| --- | --- |
| `sets/P20/full.txt` and the other list files | One task id per line, ready for the runner; lines that start with `#` are comments |
| `sets/P20/slices.md` | Every part of P20 with its tasks: group, statement source, size of the fix, test time, title |
| `sets/ALL_SETS.md` | The six sets and their parts in one table |
| `sets/CUSTOM.md` | The custom cuts (three parts, five parts) |
| `sets/_tasks/portfolio20.jsonl` and the other five | The task rows themselves, in the competition's format with the FreshSWE-Py fields |
| `~/bcf/data/freshswe-py/tasks.jsonl` on the Zorin machine | The data set as published (663 tasks): what the runner reads; the lists select tasks from it |

The runner takes the published `tasks.jsonl` and a list file; the list file selects the tasks. So a list is a lens on the data set, not a copy of it.

##### 6. What the sets do not cover

| Not covered | Where to look instead |
| --- | --- |
| The public repositories of the competition | The public 129 tasks of the competition data package (21.9 GB, not needed for these sets) |
| Tasks with `async` code, large fixes or slow test files | Left out on purpose. P20 holds fixes of at most 28 lines with test files of at most 6.1 seconds; R1 to R4 hold fixes of at most 33 lines with test files of at most 5.7 seconds; none has `async` code, which the competition's scored tasks do not have either |
| Other held-out sets (OOD-45, OOD-B, OOD-C) | Document 04 of the portfolio package: they need their own runner |

### F12. Playbook 4: cut a set of 20 into smaller sets for fast loops

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 4. Cut a set of 20 into smaller sets for fast loops.”*

**Goal:** spend minutes instead of hours on each turn of the loop while you change the brain, without losing the meaning of the set. Every set is already cut: the lists are in `sets/`, and `tools/make_slices.py` makes them again or makes other cuts.

##### 1. Why cut: what a run costs

One task-run takes about 277 seconds at the pace of the strongest public bundles on the scorer's hardware, and at most 8 minutes (the budget of the bundle). A comparison needs every task run by both versions.

| Part | Tasks | Task-runs for two versions | At 277 seconds each | At the 8-minute limit |
| --- | --- | --- | --- | --- |
| `smoke_1` | 1 | 2 | 9 minutes | 16 minutes |
| `smoke_3` | 3 | 6 | 28 minutes | 48 minutes |
| One slice (`slice_A` to `slice_D`) | 5 | 10 | 46 minutes | 80 minutes |
| One half (`half_1`, `half_2`) | 10 | 20 | 92 minutes | 160 minutes |
| A full set | 20 | 40 | 3 hours 5 minutes | 5 hours 20 minutes |
| One half of B40 | 20 | 40 | 3 hours 5 minutes | 5 hours 20 minutes |
| B40 | 40 | 80 | 6 hours 9 minutes | 10 hours 40 minutes |

One version alone takes half. Your RTX 5090 may be faster than the scorer; then treat the first column as an upper bound and the table as a scale.

##### 2. The parts of a set

| Part | List files | Tasks each | Built how | Use it for |
| --- | --- | --- | --- | --- |
| Smoke, one task | `smoke_1.txt` | 1 | The cheapest closed-issue task that both baselines solved | Does the whole pipeline run? |
| Smoke, three tasks | `smoke_3.txt` | 3 | The cheapest closed-issue task of each group (both, one, neither); it contains `smoke_1` | Seeing the three kinds of outcome |
| Slices | `slice_A.txt` to `slice_D.txt` | 5 | The set dealt into four parts with the same shares; `slice_A` holds the three smoke tasks | The quick loop |
| Halves | `half_1.txt`, `half_2.txt` | 10 | `slice_A` + `slice_B`, and `slice_C` + `slice_D` | A steadier look before a full run |
| The full set | `full.txt` | 20 | The whole set | Decisions |
| Check slices | `check_A.txt` to `check_D.txt` | 5 | A second cut into four: the same shares, other tasks together | Finding out whether a slice result was a property of those five tasks |
| By group | `solved_both.txt`, `solved_one.txt`, `solved_neither.txt` | 9, 7, 4 | Which baseline agents solved the task | A change meant for one kind of task |
| By statement | `issues.txt`, `pull_requests.txt`, `changelogs.txt` | 13, 6, 1 in P20 | Where the statement comes from | A change to how the planner reads an issue or a pull request |
| Custom cuts | `custom/trio_A.txt` ... and `custom/fifths_A.txt` ... | 7, 7, 6 and 4, 4, 4, 4, 4 | The same deal into three parts and into five | Other loop sizes |

B40 has `quarter_A` to `quarter_D` (10 tasks each) instead of slices, halves of 20 and no smoke sets, because it is for confirmation only. The numbers of this table are P20's; `sets/<NAME>/slices.md` gives every set's.

The parts nest: `smoke_1` is in `smoke_3`, `smoke_3` in `slice_A`, `slice_A` in `half_1`, `half_1` in the full set. A result found on a small part can be checked on the part that contains it without changing tasks.

##### 3. How the cut is made

Nothing in the cut is random, so the lists are the same on every machine and every day:

1. Every task has a **group** (both, one or neither baseline agent solved it) and a **statement source** (closed issue, pull request, commit and changelog). Group and source together make a cell.
2. The groups are shared out over the four slices: the floor of group size divided by 4 for every slice, and each spare task to the slice that is smallest at that moment. In a set of 20 every slice gets 4 tasks a baseline solved and 1 that none solved.
3. Inside each group the statement sources are shared out over the slices in the same proportion, without changing what step 2 gave each slice.
4. Inside each cell the tasks are ordered, cheapest first (test time, fix size, statement length, id), and dealt to the slices: `slice_A` gets the cheapest of each cell, and each slice gets its share of the cheap and of the expensive end.
5. The three smoke tasks are moved into `slice_A` by a swap inside their cell, so that every slice keeps its shares.
6. The check cut repeats steps 1 to 5 with one change: every cell is dealt to the slices in the opposite order, the last slice first. So `check_D` holds the cheapest tasks and `check_A` the most expensive ones, and a slice of one cut shares at most a few tasks with a slice of the other.

The script checks all of this itself and stops if a rule is broken.

##### 4. The cut of P20, task by task

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.2 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 1 | 0.8 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 5.3 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 7.3 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 2 | 13.8 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 12.0 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 16.0 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 9.8 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 3 | 9.0 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 3.6 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 7 | 3 | 0 | 3 | 12.6 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 6 | 3 | 1 | 3 | 25.8 s |
| `full.txt` | 20 | 9 | 7 | 4 | 13 | 6 | 1 | 3 | 38.4 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 3 | 10.2 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 5 | 2 | 0 | 3 | 22.1 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 3 | 1 | 0 | 2 | 6.1 s |
| `issues.txt` | 13 | 5 | 5 | 3 | 13 | 0 | 0 | 3 | 22.4 s |
| `pull_requests.txt` | 6 | 3 | 2 | 1 | 0 | 6 | 0 | 3 | 15.4 s |
| `changelogs.txt` | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0.6 s |

###### smoke_1.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |

###### smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 3 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

###### slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 4 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 5 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

###### slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 2 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 3 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |

###### slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |
| 5 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |

###### slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 2 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 3 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 4 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 5 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |

The halves are `half_1` = `slice_A` + `slice_B` and `half_2` = `slice_C` + `slice_D`. For the other sets, the same tables are in `sets/R1/slices.md` and so on, and in Appendix B of the HTML guide.

##### 5. Step by step: from a set to a loop

**Step 1. Look at the parts.** (executed here on Windows)

```bash
python3 tools/run_set.py --list
```

prints every set with its parts and sizes. For the tasks of a part open `sets/<NAME>/slices.md`.

**Step 2. Check that the lists are whole.** (executed here)

```bash
python3 tools/make_slices.py --check
```

**Expect:** `all files match the rules`. If a list was edited by hand, the next command writes every list again.

**Step 3. Run one part with one version.** (not run here)

```bash
python3 tools/run_set.py --set P20 --part slice_A --version v2
```

The tool checks the list, the data, the bundle and the results folder, prints the command, runs it, and writes the results to `~/bcf/results/P20/slice_A/v2-run1`. Run it again and you get `v2-run2`; nothing is overwritten. For B40 write `--set B40 --part quarter_A`.

**Step 4. Pair it with the other version.**

```bash
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1 --name v1 v2
```

Playbook 5 explains how to read it.

**Step 5. Take the next part.** When a change looks good on `slice_A`, run `slice_B`, then `check_B` (other tasks, same shares). When a change looks bad, fix it and run `slice_A` again: it is the cheapest way to see whether the fix works.

**Step 6. Make other cuts if you want them.** (executed here: the two custom cuts of the folder were made this way)

```bash
python3 tools/make_slices.py --custom trio=3 --custom fifths=5
```

cuts every set into three parts (7, 7 and 6 tasks) and into five parts of 4. The lists go to `sets/<NAME>/custom/`, the table to `sets/CUSTOM.md`, and you run one with `--part custom/trio_A`. Any number from 2 to 10 parts works. To make the standard lists again: `python3 tools/make_slices.py` without options.

##### 6. Which part for which loop

| You just | Run | Because |
| --- | --- | --- |
| Installed everything, or changed the bundle's structure | `smoke_1` | One task tells in minutes whether the pipeline works |
| Changed a prompt or a rule of the helper | `smoke_3`, then `slice_A` | The same five tasks every time: you learn how the brain acts on them and see a change at once |
| Seen a gain or a loss on `slice_A` and want to know whether it is real | `slice_B`, or `check_B` | Other tasks, same shares |
| Changed how the planner reads a statement | `issues` (13 tasks) or `pull_requests` (6 tasks) | Only those tasks can show it |
| Changed something meant for hard tasks | `solved_neither` (4 tasks) or `solved_one` (7 tasks) | The easy tasks would pass anyway |
| Seen the same result on two slices | `half_1` (10 tasks) | Twice the tasks, one quarter of the full set's time |
| Decided to keep a change | `full` (20 tasks), three paired runs | A decision needs the whole set (Playbook 5) |

##### 7. What a part can and cannot show

A comparison of two versions on a few tasks is read with the sign test: count the tasks one version solved and the other did not. The table gives, for a number of pairs (one task run by both versions), the smallest split that chance would produce less than 5 percent of the time.

| Pairs | Smallest split that is not chance | Its p |
| --- | --- | --- |
| 1 to 5 | None: five wins and no loss gives p = 0.062 | --- |
| 6 | 6 wins, 0 losses | 0.031 |
| 10 | 9 wins, 1 loss | 0.021 |
| 20 | 15 wins, 5 losses | 0.041 |
| 40 | 27 wins, 13 losses | 0.038 |
| 60 | 39 wins, 21 losses | 0.027 |
| 80 | 50 wins, 30 losses | 0.033 |
| 100 | 61 wins, 39 losses | 0.035 |

So:

| A part | Can show | Cannot show |
| --- | --- | --- |
| `smoke_1`, `smoke_3` | Whether the pipeline runs; how the brain acts on a task | Anything about the score |
| A slice of 5 | That a change broke something or fixed a task you were watching; where the time goes | Whether the change is better: no split of 5 pairs is beyond chance |
| A half of 10 | The same, on more tasks | Whether the change is better: it would need 9 wins and 1 loss |
| The full set, once | A first paired number | A decision: two identical runs differ by about 2 tasks in 20 |
| The full set, three paired runs, or four sets once | A decision | That it holds on other kinds of repository, unless you rotated sets (Playbook 6) |

A slice is for speed and for seeing. A decision is made on full sets, and confirmed once on B40.

##### 8. The smoke tasks of the other sets

| Set | The task of smoke_1 | Repository | Solved by (baselines) | Reference fix | Gold test |
| --- | --- | --- | --- | --- | --- |
| P20 | `click_3434` | click | both | 8 lines | 0.2 s |
| B40 | none: B40 is for confirmation only | - | - | - | - |
| R1 | `isort_2581` | isort | both | 6 lines | 0.5 s |
| R2 | `w3lib_266` | w3lib | both | 2 lines | 0.3 s |
| R3 | `pluggy_767` | pluggy | both | 21 lines | 0.4 s |
| R4 | `markdown_it_py_416` | markdown-it-py | both | 10 lines | 0.2 s |

The lists for R1 to R4 are the same kinds of files as for P20 (`smoke_1`, `smoke_3`, `slice_A` to `slice_D`, `half_1`, `half_2`, `check_A` to `check_D`, the lists by group and by statement). For B40: `quarter_A` to `quarter_D`, `half_1`, `half_2`, `check_A` to `check_D`, and the lists by group and by statement.

##### 9. The custom cuts that ship with the playbook

Made with `--custom NAME=PARTS` (repeatable). The list files are in `sets/<NAME>/custom/`.

##### trio: every set cut into 3 parts

Each cell: tasks in the part (solved by both baseline agents + by one + by neither). Run one with `--part custom/trio_A`.

| Set | trio_A | trio_B | trio_C |
| --- | --- | --- | --- |
| P20 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| B40 | 14 (5+4+5) | 13 (5+3+5) | 13 (4+3+6) |
| R1 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R2 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R3 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R4 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |


##### fifths: every set cut into 5 parts

Each cell: tasks in the part (solved by both baseline agents + by one + by neither). Run one with `--part custom/fifths_A`.

| Set | fifths_A | fifths_B | fifths_C | fifths_D | fifths_E |
| --- | --- | --- | --- | --- | --- |
| P20 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| B40 | 8 (3+2+3) | 8 (3+2+3) | 8 (3+2+3) | 8 (3+2+3) | 8 (2+2+4) |
| R1 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R2 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R3 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R4 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |

##### 10. How to change the way the sets are cut

The rules live at the top of `tools/make_slices.py`, in the functions `group_shares`, `split_group` and `cut`. To change what a slice holds, change them and run the script; it stops with a clear message when a rule is broken, and `tools/selftest.py` compares what it writes with the lists in the folder. To change which tasks a set holds, use `tools/build_rotation.py` of the portfolio package: the sets come from there.

### F13. Playbook 5: compare two versions of the brain

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 5. Compare two versions of the brain.”*

**Goal:** decide, with numbers that mean something, whether a change to the brain is an improvement. The comparison is **paired**: both versions run the same tasks of the same set, in the same sandbox, with the same budgets, and every task is compared with itself.

| Item | Statement |
| --- | --- |
| Time | A loop on a slice: about 45 minutes per version at the scorer's pace. A decision: three paired runs of a full set, about 4.5 hours per version, plus B40 once |
| What was executed for this playbook | `compare.py` and `ledger.py`, on pretend results written in the harness's own result format (`tools/selftest.py`). No model was called, so the example below is from pretend results and says so |
| The one rule to remember | Two identical runs of the same agent differ on about 2 tasks in 20. A change smaller than that is invisible in one run, whatever the score looks like |

##### 1. What a version is

A version is one build of the brain, in its own folder under `~/bcf/brain/dist/`, under a name you choose: `v1`, `v2`, `flat-2`. The tools record a checksum of the bundle with every run, so two runs can be shown to use the same build. To make a new version after a change under `~/bcf/brain/parts/` or `src/prompts/` (from the setup guide of the 2026-11-24 package; not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/brain
python assemble.py && python build.py
python -m unittest tests.test_bcf
python tools/run_validator.py
```

**Expect:** `OK` from the tests; from the validator, the official compiler at 6 of 6 and the controls at 15 of 15 (the figures of the 2026-11-24 package). Then give the folder a name in `playbook.conf` (`BUNDLE=dist/bcf-31b-flat`) or pass it to each command (`--bundle dist/<folder>`).

##### 2. The protocol

| Step | Rule | Reason |
| --- | --- | --- |
| 1. Gate | The reference fix resolves every task and no patch resolves none, in the sandbox used for the run | A broken environment looks exactly like a weak agent |
| 2. Pair | The same tasks in the same order for both versions, in the same sandbox image | Pairing cancels the difficulty of the tasks |
| 3. Repeat | At least three runs per version | One run has a noise band of about 2 tasks |
| 4. Budgets | Those of the bundle's `eval_config.yaml` (8 minutes, 28 tool calls, 80 turns, 240 seconds per command); never override them for a comparison | A version that only wins with a larger budget has not won |
| 5. Speed | The model server runs at one speed for both versions, with nothing else on the GPU | A faster server flatters long thinking |
| 6. Decide | The change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses over the paired runs | The rule of the measurement protocol of the portfolio package |
| 7. Confirm | Run the adopted version and the incumbent once each on B40; keep the change only if B40 does not contradict the set | Guards against a change tuned to one set by accident |
| 8. Log | One line per run in `LEDGER.md`, a note of what the change was | The score alone does not say why |

The runner applies rule 4 by itself: it reads the budgets from the bundle.

##### 3. The loop on a slice

While a change is being written, work on one slice; both versions, the same slice (not run here):

```bash
cd ~/bcf/playbook
python3 tools/run_set.py --set P20 --part slice_A --version v1 --bundle dist/bcf-31b-flat
python3 tools/run_set.py --set P20 --part slice_A --version v2 --bundle dist/bcf-31b-flat-v2
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1 --name v1 v2
```

**What to read:** the tasks that changed (table 4 of the output) and their logs. Five tasks cannot rank two versions (Playbook 4, Section 7); they can show that a change does what you meant on the tasks you watch, and that nothing obvious broke.

##### 4. The decision on a full set

When the change looks right on slices (not run here; about 4.5 hours per version at the scorer's pace):

```bash
for v in v1 v2; do for r in 1 2 3; do
  python3 tools/run_set.py --set P20 --part full --version $v --run $r
done; done
python3 tools/compare.py v1=~/bcf/results/P20/full/v1-run1 v1=~/bcf/results/P20/full/v1-run2 v1=~/bcf/results/P20/full/v1-run3 \
                        v2=~/bcf/results/P20/full/v2-run1 v2=~/bcf/results/P20/full/v2-run2 v2=~/bcf/results/P20/full/v2-run3 \
                        --md ~/bcf/results/P20/full/v1-against-v2.md
python3 tools/ledger.py
```

The loop is typed as one block. `compare.py` pairs the first run of `v1` with the first of `v2`, the second with the second, and so on, and pools the 60 pairs. The report is written next to the results and `LEDGER.md` has one line per run.

##### 5. How to read the report

The report has five parts. This is the real output of `compare.py` on **pretend results** (written by a script for this example, not by the brain), cut to the first rows of the fourth table:

```text
# before against after

## 1. The runs

| Version | Set and part | Run | Tasks | Resolved | Rate | Mean seconds per task | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| before | P20/full | va-run1 | 20 | 10 | 50% | 340 s | 0 |
| before | P20/full | va-run2 | 20 | 14 | 70% | 340 s | 0 |
| after | P20/full | vb-run1 | 20 | 14 | 70% | 340 s | 0 |
| after | P20/full | vb-run2 | 20 | 16 | 80% | 340 s | 0 |

## 2. Paired, task by task

| Pairs | Solved by both | before only | after only | Neither | Difference (after minus before) | p of the sign test |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 40 | 14 | 10 | 16 | 0 | +6 | 0.327 |

## 5. What it means

- 40 pairs from 2 paired runs of each version: provisional. The adoption rule is read after three paired runs of a full set; two identical runs of one agent differ by about 2 tasks in 20 (Playbook 5).
- So far: mean resolved per run before 12.0, after 15.0; tasks gained 16, tasks lost 10.
- p = 0.33 of the sign test on the 26 pairs that differ: a difference this large is within what chance produces.
```

| Part of the report | What it tells you |
| --- | --- |
| 1. The runs | Whether every run has its tasks and no errors; a run with errors is read after the errors are understood |
| 2. Paired | The tasks only one version solved. The difference and the p-value come from the sign test on those tasks alone |
| 3. By group and by statement | Where the change helps: on tasks both baselines solved (the core), on the margin, or on a kind of statement |
| 4. The tasks that changed | The list to read, task by task, with the logs of the runs: this is where the cause is |
| 5. What it means | The size of the evidence, and whether the adoption rule is met |

With three paired runs the last part states whether the adoption rule is met: the mean resolved count per run is higher, and more tasks are gained than lost over the 60 pairs.

##### 6. What to do with the result

| Result | Next |
| --- | --- |
| Errors in a run | Stop. Find the error in `task_results.jsonl` (the `error` field) and in Playbook 7; an error is a property of the machine, not of the brain |
| The rule is not met | The change is not kept. Read the lost tasks before dropping it: a change that gains 8 and loses 7 may be two changes |
| The rule is met | Confirm once on B40 (Playbook 6); keep the change only if B40 does not contradict P20 |
| The rule is met but the gain is on the margin only | Run the same comparison on a rotation set (Playbook 6): a gain that shows only on one set is a tuned gain |

##### 7. What not to do

| Do not | Because |
| --- | --- |
| Compare a run on one set with a run on another set | The sets hold different tasks; the difference would be the tasks, not the brain |
| Decide on one run | Two identical runs differ by about 2 tasks in 20 |
| Run two versions at the same time on the GPU | The server slows down and the budgets (8 minutes per task) cut the agent short |
| Give the new version more time, calls or turns | It would win for the wrong reason |
| Keep the change because the score went up and ignore the lost tasks | The rule counts gains and losses task by task for that reason |
| Use B40 more than once per decision | After it has shaped a change, it can no longer judge it |

### F14. Playbook 6: rotate through the sets, and confirm a decision

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 6. Rotate through the sets, and confirm a decision.”*

**Goal:** never let a change be judged by the tasks it was shaped on, and make the final decision on sets that have not been touched. Five sets of 20 and one of 40 are enough for a whole line of work.

##### 1. The three rules

| Rule | Reason |
| --- | --- |
| Both versions always run on the same set | The sets hold different tasks: a result on R1 and a result on R2 are two different tests, even with 20 tasks each |
| Each new comparison uses a set that was not used while the change was written | A set whose tasks you have read while fixing a change can no longer judge that change |
| When the difference is small, pool sets rather than repeat one | Repeats answer "is it real on these tasks"; rotation answers "does it hold on other kinds of repository" |

##### 2. A schedule that uses every set once

| Comparison | Set | Task-runs for two versions | Time at the scorer's pace |
| --- | --- | --- | --- |
| Change 1 | P20 | 40 | 3 hours |
| The loops while every change is written | Slices of the set in use (`slice_A` first, then `slice_B` or `check_B`) | 10 per loop | 46 minutes per loop |
| Change 2 | R1 | 40 | 3 hours |
| Change 3 | R2 | 40 | 3 hours |
| Change 4 | R3 | 40 | 3 hours |
| Final check | R4, then B40 | 40 and 80 | 3 hours and 6 hours |

When the four changes are done, start again at P20: by then its tasks have not been read for a while. Keep R4 and B40 untouched until the final check, and write down which set served which change, in a table like this one (keep it in a file of your own):

| Change | Date | Sets read during development | Set of the decision | Result | Sets still untouched |
| --- | --- | --- | --- | --- | --- |
| example: shorter planner prompt | 2026-11-27 | P20 (slice_A, slice_B) | P20, three paired runs | rule met | R1, R2, R3, R4, B40 |

##### 3. What pooled sets can show

A pair is one task run by both versions. The table gives the share of experiments in which a real change is detected (the exact paired sign test, as in Document 06 of the portfolio package).

| Real effect of the change | One set, 20 pairs | Two sets, 40 pairs | Three sets, 60 pairs | Four sets, 80 pairs | Five sets, 100 pairs |
| --- | --- | --- | --- | --- | --- |
| Gains 2 tasks per 20, loses none | 1 percent | 21 percent | 56 percent | 82 percent | 94 percent |
| Gains 2, loses 1 | 1 percent | 5 percent | 9 percent | 13 percent | 18 percent |
| Gains 4, loses 1 | 10 percent | 36 percent | 58 percent | 74 percent | 84 percent |
| Gains 4, loses none | 20 percent | 84 percent | 99 percent | 100 percent | 100 percent |
| Gains 6, loses 2 | 17 percent | 44 percent | 63 percent | 78 percent | 88 percent |

A change that gains four tasks per 20 and loses one is detected 36 percent of the time on two sets and 74 percent on four. One run of each version on four sets (80 pairs) costs the same as four paired runs of one set, and tells you in addition that the change holds on other repositories.

##### 4. Step by step: a comparison on a new set

**Step 1. The gate**, the first time the set is used (not run here):

```bash
python3 tools/gates.py --set R1 --part full
```

**Step 2. Loops on its slices if the change is still moving** (not run here):

```bash
python3 tools/run_set.py --set R1 --part slice_A --version v3
python3 tools/run_set.py --set R1 --part slice_A --version v4
python3 tools/compare.py ~/bcf/results/R1/slice_A/v3-run1 ~/bcf/results/R1/slice_A/v4-run1
```

**Step 3. The full set, three paired runs, or several sets once.** The commands are those of Playbook 5 with `--set R1`, then `--set R2`, and so on. Pool the sets in one report:

```bash
python3 tools/compare.py v3=~/bcf/results/R1/full/v3-run1 v3=~/bcf/results/R2/full/v3-run1 \
                        v4=~/bcf/results/R1/full/v4-run1 v4=~/bcf/results/R2/full/v4-run1
```

The names in `v3=...` are the version names; the tool pairs the runs in the order they are listed.

##### 5. The confirmation on B40

B40 has 40 tasks of the same three repositories as P20, with larger fixes (median 22 lines against 7 in P20). It is used once per decision, for the version you are about to keep and the one it replaces.

**Step 1. The gate**, if B40 has not been gated yet (not run here):

```bash
python3 tools/gates.py --set B40 --part full
```

**Step 2. The first half, both versions** (not run here; about 3 hours at the scorer's pace):

```bash
python3 tools/run_set.py --set B40 --part half_1 --version v4
python3 tools/run_set.py --set B40 --part half_1 --version v3
python3 tools/compare.py ~/bcf/results/B40/half_1/v3-run1 ~/bcf/results/B40/half_1/v4-run1
```

**Step 3. Read, then decide whether to continue.** If the new version is clearly behind on the first half (more tasks lost than gained), stop here: the change contradicts B40 and is not kept. Otherwise run the second half with the same three commands and `--part half_2`, and read both halves together:

```bash
python3 tools/compare.py v3=~/bcf/results/B40/half_1/v3-run1 v3=~/bcf/results/B40/half_2/v3-run1 \
                        v4=~/bcf/results/B40/half_1/v4-run1 v4=~/bcf/results/B40/half_2/v4-run1
```

The two halves are paired by their order in the list. A change is kept when the set of the decision (P20 or a rotation set) showed the rule met and B40 does not contradict it: about as many tasks gained as lost, or more.

**Step 4. Write it down.** `python3 tools/ledger.py` updates `LEDGER.md`; add the line to your own table of Section 2.

##### 6. The checklist of a decision

- [ ] The gate of every set used has passed (20 of 20 and 0 of 20; 40 of 40 and 0 of 40 for B40)
- [ ] Both versions ran on the same tasks, in the same sandbox, with the bundle's budgets
- [ ] Three paired runs of a full set, or the same number of pairs pooled over rotation sets
- [ ] No run has a harness error
- [ ] The adoption rule is met: a higher mean and strictly more tasks gained than lost
- [ ] The lost tasks were read, not only counted
- [ ] B40 ran once for both versions and does not contradict the decision
- [ ] The ledger and your table name the change, the sets and the result

### F15. Playbook 7: troubleshooting

*Attached in full, as written on 2026-11-25. Its own title: “Playbook 7. Troubleshooting.”*

**Goal:** find the cause of what went wrong, in the order that saves time: the machine first, then the environment, then the run, then the brain.

##### 1. First: where to look

| Order | Ask | How |
| --- | --- | --- |
| 1 | Is the machine ready? | `python3 tools/check_setup.py`: every failed row names the step to repeat |
| 2 | Is the server up? | `curl -s http://127.0.0.1:8000/v1/models` must show the bundle's model name |
| 3 | Did the tasks themselves fail, or the agent? | `python3 tools/gates.py --set <set> --part full`: the gate calls no model, so a failure here is the environment |
| 4 | Did the run end with harness errors? | Open `<run folder>/task_results.jsonl`: the `error` field of a row says why a task has no result |
| 5 | What did the agent do? | The folder `logs` of the run (one log per task) and the server's log (`tail -n 50 ~/bcf/vllm-31b.log`) |
| 6 | What did the tests say? | The folder `test_outputs` of the run: the output of the hidden tests |

A run folder is `~/bcf/results/<set>/<part>/<version>-run<number>`.

##### 2. Installation

| Symptom | Cause | Fix |
| --- | --- | --- |
| `nvidia-smi` is not found, or shows no driver | The NVIDIA driver is not installed or blocked | Zorin Menu, System Tools, Software Updater, Settings, Additional Drivers: the newest "(proprietary)" NVIDIA driver; if still not, switch Secure Boot off in the firmware (Playbook 1, step 1) |
| `uv: command not found` in a new terminal | The folder of `uv` is not on the path of this terminal | `source "$HOME/.local/bin/env"`; it is added to the shell's start-up file by the installer, so a new terminal finds it |
| `uv python install` gives a version other than 3.12.13 | The version was typed differently | `uv python list` shows what is installed; the environments need exactly 3.12.13 |
| `kaggle: command not found` | The Kaggle command line was not installed, or its folder is not on the path | `uv tool install kaggle`, then `source "$HOME/.local/bin/env"` |
| `403 Forbidden` or `Unauthorized` from `kaggle` | The token file is missing, in the wrong place, or the competition's or data set's rules were not accepted | The file must be `~/.kaggle/kaggle.json` with permissions 600; accept the rules on the data set's page in the browser |
| `unzip` says the file is not a zip archive | The download stopped early | Download again; the data set is 6.97 GB |
| `docker: permission denied` on `docker run` | Your user was not yet in the docker group | Log out and in again after `sudo usermod -aG docker "$USER"` |
| `docker build` cannot find `wheelhouse/locks` or the Dockerfile | The build was not started from the release root | `cd ~/bcf/data/freshswe-py` first; the command is `docker build -t freshswe-sandbox:latest -f docker/Dockerfile .` |
| No disk space | The model, the data and the two environments need about 45 GB | `df -h ~`; remove the zip files after unpacking (the steps do), give Zorin 150 GB or more |

##### 3. The two Python environments

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ModuleNotFoundError: No module named 'docker'` (or `litellm`, `cachetools`, `networkx`) when the runner starts | The harness packages are installed but not what they import: the wheelhouse does not bring it | In the harness environment: `python tools/finish_env.py`, then `python tools/check_setup.py` |
| `ModuleNotFoundError` in the **model server** environment | A package was installed into the wrong environment | The server environment holds only the server; the harness lives in `~/.venv-harness`. Check which interpreter is active: `which python` |
| `uv` refuses to install with a long message about `starlette` or `mcp` | The two dependency trees were mixed in one environment | That is why there are two environments (Playbook 1, step 8). Remove the one that was mixed (`rm -rf ~/.venv-harness`) and repeat steps 8 and 12 |
| `finish_env.py` stops on `could not install ...` | No network, or a wheel missing for this platform | Read the message above it; re-run the script, it continues where it stopped |
| `finish_env.py` ends with "other error in ..." | Two packages do not fit together | Note the module and the message; run `python tools/finish_env.py --check` and follow the notes below |
| The pre-flight check fails with `the harness packages are not importable` | The runner is started with the wrong interpreter | `source ~/.venv-harness/bin/activate`, and `PYTHON=~/bcf/.venv-harness/bin/python` in `playbook.conf` |
| `No module named 'swegemma'` inside the sandbox image | Nothing is wrong: the sandbox holds the repositories' packages, not the harness | The message must come from the harness process; if it comes from a task log, the agent's own installer failed (next section) |

The facts behind this section, measured on 2026-11-25: the competition wheelhouse (version 31) has 41 wheels and brings the four harness packages but not `docker` or `litellm`, which swegemma 0.2.11 requires. vLLM 0.19.1 needs `mcp` 2 and `starlette` 1.0 or later; google-adk 1.36.1 needs `mcp` below 2 and `starlette` below 1.0. `finish_env.py` installs the harness tree (155 packages, resolved once with uv) into its own environment.

##### 4. The model server

| Symptom | Cause | Fix |
| --- | --- | --- |
| `no OpenAI-compatible server answered` when a run starts | The server is not running, or on another port | Start it (Playbook 2, step 3); `BASE_URL` in `playbook.conf` must match `--port` |
| `the bundle declares ... but the server serves ...` | `--served-model-name` differs from the `model:` line of the bundle | Start the server with `--served-model-name gemma-4-31b-it-qat-w4a16-ct` for `bcf-31b-flat` |
| The server does not come up; the log ends with an attention-backend message | Gemma 4's mixed head dimensions and the selected attention backend | Read the backend line in the log; an earlier guide of this project set `VLLM_ATTENTION_BACKEND=TRITON_ATTN` for this case |
| The server answers slowly | Something else uses the GPU, or two runs share it | `nvidia-smi` lists the processes; run one thing at a time |
| The model loads very slowly | The weights are read through a mounted Windows disk | Keep `~/bcf/models` in the Linux file system |
| `CUDA out of memory` at start | The model and the KV cache do not fit | 17 to 18 GB of weights on 32 GB should fit; close other GPU programs; if needed lower `--gpu-memory-utilization` |
| The server stops by itself during a run | The terminal it ran in was closed, or memory ran out | Start it with the `&` of Playbook 2 so that it survives the log view, and keep the terminal open |

##### 5. The gate

| Symptom | Cause | Fix |
| --- | --- | --- |
| `reference fix resolves` fewer tasks than expected | The sandbox image lacks a package or a test plugin, or the image was built from a partial release | Read the row in `gates.md`; rebuild the image from the whole release root; compare with the per-task validation records of the data set (`validation/`) |
| `no patch resolves` more than 0 | A task has no failing test in this sandbox | Drop the task only after the image is checked; such a task measures nothing |
| `gates.py` says a report folder exists | A report is never overwritten | Remove `~/bcf/results/gates/<set>-<part>/` to run it again |
| The gate takes very long | Every task starts a container and runs its tests twice | Use `--concurrency 3`; the gate calls no model |

##### 6. A run

| Symptom | Cause | Fix |
| --- | --- | --- |
| `run_set.py` prints `FAIL` lines and runs nothing | A path in `playbook.conf` is wrong, or the results folder exists | Read each `FAIL` line; it names the path. For an existing run give `--run 2` |
| `FAIL results folder ... is free` | That run number is taken | Let the tool pick the next number (omit `--run`) or give a free one |
| The runner exits with code 2 | No server, or another model name | See "The model server" |
| Every task ends at once with an error about the snapshot | The `snapshots` folder does not match the tasks | `DATA` must be the release root: `<DATA>/snapshots/<task id>.tgz` |
| A task ends with `No module named ...` inside the agent's calls | The agent's installer could not set up its helper in the sandbox | Open the task's log; the sandbox image is built from the release root and must contain the task's lock file |
| A task ends with "Path traversal" or "No such file" | The sandbox cannot find `python3` or `git` | Rebuild the image from the shipped Dockerfile |
| Every task gets exactly 8 minutes and no result | The model server answers errors | Read the server's log while the first task runs |
| Tasks end at the 8-minute limit with no edit | The agent is lost, or the server is too slow | Read the task's log: the last calls show whether it was thinking, waiting or looping |
| A result folder has fewer tasks than the list | The run was stopped | Run the same command again: it takes the next run number; a stopped run is never resumed in place |
| `compare.py` says a folder has no `task_results.jsonl` | The path is not a results folder | The results folder is the one `run_set.py` printed |

##### 7. The sets and the tools

| Symptom | Cause | Fix |
| --- | --- | --- |
| `make_slices.py --check` reports differences | A list file was edited by hand | `python3 tools/make_slices.py` writes every list again |
| `make_slices.py` stops with an assertion | A rule of the cut is broken by a change to the script | Read the message: it names the set and the rule |
| `selftest.py` reports a failure | A tool was changed, or the folder was copied incompletely | Copy the folder again; then run `python3 tools/selftest.py` |
| A list file is empty or missing | The set has no task of that kind (for example `changelogs.txt` of B40) | Nothing to run; `sets/<NAME>/slices.md` shows the parts that exist |
| `compare.py` reports a set or part as `?` | The run folder has no sidecar file (it was not started with `run_set.py`) | Harmless: the pairing uses the task ids, not the names |
| `check_setup.py` reports `System FAIL` on another Linux | The playbooks are written for Zorin OS 18 (Ubuntu 24.04) | It may still work; treat the steps of Playbook 1 as a guide |

### F16. Playbook reference: commands, folder map, file formats, glossary, sources

*Attached in full, as written on 2026-11-25. Its own title: “Reference.”*

Commands, the terminal, the folder map, the file formats, the glossary, the sources and the status of every claim.

##### 1. Commands

Every command is typed after `source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook`, except the server.

| To | Type |
| --- | --- |
| Start every session | `source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook` |
| Start the model server (its own terminal) | Playbook 2, step 3 |
| Is the machine ready? | `python3 tools/check_setup.py` (add `--full` for the complete import probe) |
| Do the tools work? | `python3 tools/selftest.py` |
| The sets and their parts | `python3 tools/run_set.py --list` |
| Run one part with one version | `python3 tools/run_set.py --set <set> --part <part> --version <version>` |
| The same, without running | The same, with `--dry-run` |
| Another bundle | The same, with `--bundle dist/<folder>` |
| Compare two runs | `python3 tools/compare.py <run folder A> <run folder B>` |
| Pool paired runs | `python3 tools/compare.py name=<run> name=<run> other=<run> other=<run>` |
| The table of every run | `python3 tools/ledger.py` |
| The gate on a set | `python3 tools/gates.py --set <set> --part full` |
| Write the lists again | `python3 tools/make_slices.py`; other sizes: `--custom name=3` |
| Check the lists | `python3 tools/make_slices.py --check` |
| Complete the harness environment | `python tools/finish_env.py` |
| Rebuild the HTML guide | `python3 tools/build_guide.py` (needs `pandoc`) |

##### 2. The terminal in ten lines

| Key or command | What it does |
| --- | --- |
| Zorin Menu, type `terminal`, Enter | Opens a terminal |
| `Ctrl+Shift+V` | Pastes into the terminal (or right-click, Paste); `Ctrl+V` does not |
| `Ctrl+C` | Stops what runs in the terminal (the server itself was started with `&` and keeps running) |
| Arrow up and down | Brings back earlier commands |
| `Tab` | Completes a file name |
| `cd <folder>` | Goes to a folder; `cd ~` to the home folder; `cd ..` one level up |
| `ls` | Lists the folder; `ls ~/bcf` lists another |
| `sudo <command>` | Runs a command as administrator; it asks for your password |
| `cat <file>`, `less <file>` | Prints a file; `less` pages it (`q` to leave) |
| `tail -n 50 <file>`, `tail -f <file>` | The last 50 lines of a file; `-f` follows it while it grows |

A line that starts with `#` is a comment. Copy a whole block at a time. When a command prints nothing and returns to the prompt, it worked.

##### 3. The folder map on the Zorin machine

| Path | Content | Made in |
| --- | --- | --- |
| `~/bcf/playbook` | This playbook | Playbook 1, step 4 |
| `~/bcf/brain` | The brain; `dist/` holds the bundles | Playbook 1, step 4 |
| `~/bcf/tools` | `run_panel.py` and the other tools of the 2026-11-24 package | Playbook 1, step 4 |
| `~/bcf/.venv` | The environment of the model server | Playbook 1, step 7 |
| `~/bcf/.venv-harness` | The environment of the harness | Playbook 1, steps 8 and 12 |
| `~/bcf/data/freshswe-py` | The data set as published | Playbook 1, step 6 |
| `~/bcf/wheelhouse` | The 41 wheels of the competition | Playbook 1, step 5 |
| `~/bcf/models` | The weights of the model | Playbook 1, step 9 |
| `~/bcf/results` | Every run: `<set>/<part>/<version>-run<number>`; the gates under `gates/` | as you work |
| `~/bcf/env` | What `finish_env.py` added to the harness environment | Playbook 1, step 12 |
| `~/.kaggle/kaggle.json` | Your Kaggle token; never shown, never read by the tools | Playbook 1, step 6 |
| `~/bcf/vllm-31b.log` | The log of the model server | Playbook 2, step 3 |

##### 4. File formats

**A list file** (`sets/P20/slice_A.txt`): lines that start with `#` are comments; every other line is one task id.

**The row of a result** (`task_results.jsonl` in a run folder): one JSON object per line, written by the harness itself. Its fields, read from the harness's source (swegemma 0.2.11, `results.py`):

| Field | Content |
| --- | --- |
| `instance_id`, `repo` | The task |
| `resolved` | True when the hidden tests pass with the agent's patch |
| `agent_patch_size` | Size of the agent's patch in characters; 0 when it made none |
| `test_exit_code` | Exit code of the test run |
| `duration_seconds` | Wall-clock time of the task |
| `error` | Why the task has no result, or null |
| `tool_calls`, `total_llm_calls` | How much the agent used its budgets |
| `task_index` | Position of the task in the run |

**The sidecar** (`<run folder>.json`): written by `run_set.py`: the set, the part, the version, the run number, the task ids, the command, the bundle and its checksum, the sandbox, start and finish, the exit code.

**The summary** (`summary.json` in a run folder): `total_tasks`, `resolved`, `resolution_rate`, `by_repo`, `errors`.

**The gate report** (`~/bcf/results/gates/<set>-<part>/gates.md` and `passed.txt`): per task whether the reference fix resolved it and whether no patch did.

**The ledger** (`LEDGER.md` in the playbook folder): one line per run, written by `tools/ledger.py`.

**The configuration** (`playbook.conf`): lines `NAME=value`; `~` means the home folder.

##### 5. Glossary

| Word | Meaning |
| --- | --- |
| Agent, the brain | The program that reads a task and writes a patch: a planner and a solver built on Google's Agent Development Kit, with a small helper |
| Baselines | Two reference agents whose results on every task were published with the data set |
| Bundle | The folder that becomes a submission: `agent.yaml`, prompts, the helper, `eval_config.yaml` |
| Gate | Proof that the reference fix passes and no patch fails on a task, in the sandbox used for the run |
| Harness | The competition's grading software (`swegemma`): it starts the sandbox, runs the agent, applies the patch and runs the hidden tests |
| Pair | One task run by both versions |
| Part | A list of a few tasks of a set |
| p-value | The probability that chance alone produces a split at least as uneven as the one observed |
| Sandbox | The Docker container in which the agent works on a copy of the repository at the base commit |
| Set | P20, R1 to R4 or B40: 20 or 40 tasks |
| Sign test | The comparison of two versions task by task: the tasks only one version solved are counted |
| Slice | A part of 5 tasks |
| Version | One build of the brain |
| vLLM | The program that serves the model on the GPU |

##### 6. Sources

| Source | Publisher | Read on | Used for |
| --- | --- | --- | --- |
| [Zorin OS technical details](https://zorin.com/os/details/) | Zorin | 2026-11-25 | 18.1 is the current version; Ubuntu 24.04 LTS; kernel 6.17; supported until 1 June 2029 |
| [How to install Zorin OS](https://help.zorin.com/docs/getting-started/install-zorin-os/) | Zorin Help | 2026-11-25 (page last modified 2026-03-23) | The installer steps, the boot-menu option for NVIDIA cards, the third-party software option, the installation types |
| [Activate NVIDIA graphics card](https://help.zorin.com/docs/hardware/activate-nvidia-drivers/) | Zorin Help | 2026-11-25 (page last modified 2026-03-24) | Driver 580 by the installer; the Additional Drivers path; Secure Boot |
| [System requirements](https://help.zorin.com/docs/getting-started/system-requirements/) and the [download page](https://zorin.com/os/download/) | Zorin | 2026-11-25 | The USB stick size; the Core edition is free |
| `07_Setup_and_Run_Guide.md` and `tools/run_panel.py` of the 2026-11-24 package | this project | written 2026-11-24 | The commands of steps 3, 7, 9 and 10 and the server settings; the runner's behaviour |
| `04_Build_Verify_and_Run.md` of the 2026-11-25 portfolio package | this project | written 2026-11-25 | Path A: run the bundle on P20 with FreshSWE-Py; the gold and empty gate |
| The FreshSWE-Py README, Dockerfile and member list (Kaggle, `moshegolderson/freshswe-py`) | the data set's author | 2026-11-25 | The layout of the release; the image is built from its root; 6.6 GB unpacked |
| The competition wheelhouse, version 31 (Kaggle, `metric/gemma-4-developer-agent-wheelhouse`) | Kaggle | 2026-11-25 | 41 wheels, 881 MB; which packages it brings and which it does not |
| `swegemma` 0.2.11 and `adk-eval-core` 0.1.0 as installed from the wheelhouse | Kaggle | 2026-11-25 | The result format; the settings and methods the gate and the pre-flight use |
| [Hugging Face API](https://huggingface.co/api/models/google/gemma-4-31B-it-qat-w4a16-ct) for the model repository | Hugging Face | 2026-11-25 | The repository is public and not gated |
| The dependency trees, resolved with uv 0.12.13 for Linux and CPython 3.12.13 (metadata only) | this project | 2026-11-25 | The server tree (179 packages), the harness tree (155 packages), and the conflicts between them |

##### 7. What is measured, what is read, what is assumed

| Statement in the playbooks | Status |
| --- | --- |
| The lists and their composition | Measured: written by `make_slices.py` and checked by `--check` and `selftest.py` |
| The minutes per part | Computed from two published figures (277 seconds per task-run; 8 minutes as the limit), not measured |
| The sign-test thresholds | Computed with the exact binomial test (`tools/compare.py` prints the same p-values) |
| The dependency facts | Measured today from the wheelhouse listing, the package metadata and two uv resolutions |
| The harness environment recipe | Executed on Windows in a new environment: lock (151 packages), probe (1,340 of 1,341 modules), pre-flight of the runner passed. Not executed on Zorin |
| The Zorin steps | Read from the official Zorin help pages today; not executed |
| The server, the Docker sandbox and the gates | Not executed: they need the GPU, Linux and the data set; the scripts were checked against the harness source and by `--selfcheck` |
| A real run and a real comparison | Not executed; no model was called |

##### 8. The other packages this playbook builds on

| Package | What it gives this playbook |
| --- | --- |
| `deliverables/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity` | The brain (`bcf-brain-patched`), `run_panel.py`, `install-wheelhouse.sh`, the setup guide and the server settings |
| `deliverables/2026-11-25_BCF_Private_Portfolio_20` | The six sets (`portfolio/`), the reasons behind them (Documents 01 and 09), the measurement protocol (Document 06) |
| `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA` | The first version of the brain and its tools; the portfolio package's scripts use some of them |

**What this playbook changes in the setup guide of 2026-11-24:** the guide put the harness and the model server into one environment, as the staff notebook does on Kaggle, where the image already holds every dependency. On a new machine that environment stops at `import swegemma`, and a strict resolver refuses to build it. The playbook uses two environments and a script that completes the harness one; the server's part of the guide is unchanged.
