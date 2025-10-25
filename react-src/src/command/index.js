import { os } from "@neutralinojs/lib";

class Command {
  async getList(dir = "/sdcard") {
    const data = await os.execCommand(`adb shell ls -ld ${dir}*`);
    if (data.stdOut) {
      // console.log(data.stdOut);

      const result = data.stdOut
        .split("\n")
        .map((e) => {
          if (!e) return {};

          const arr = e.split(" ");

          // console.log({ arr });

          let type = "FILE";
          if (arr[0].startsWith("d")) type = "DIRECTORY";
          if (arr[0].startsWith("l")) type = "SYMBOL";

          let path = arr[arr.length - 1]?.replace("\r", "");
          //   if (!path) path = arr[7];

          let splitName = path.split("/");
          let name = splitName[splitName.length - 1].replace("\r", "");

          if (type == "DIRECTORY") {
            path = path + "/";
          }

          return {
            type: type,
            path: path,
            fullPath: path,
            entry: name,
            extension: type == "FILE" ? name.split(".")?.at(-1) : "",
          };
        })
        .filter((e) => e?.type)
        .sort((a, b) => b.type.length - a.type.length);

      return result;
    }
    return [];
  }

  async getListPartition(mountMode = false, wipeMode = false) {
    try {
      let exclude = [
        "blcmd",
        "boot_b",
        "bota",
        "cp_debug",
        "cpefs",
        "dqmdbg",
        "cache_b",
        "dtbo_b",
        "efs_b",
        "keydata",
        "keyrefuge",
        "keystorage",
        "metadata",
        "misc",
        "nad_fw",
        "nad_refer",
        "odm",
        "omr",
        "optics_b",
        "persistent",
        "param",
        "prism_b",
        "product",
        "radio",
        "recovery_b",
        "sda",
        "sdb",
        "sdc",
        "sdd",
        "sde",
        "spu",
        "steady",
        "super_b",
        "system",
        "uh",
        "uhcfg",
        "userdata_b",
        "vendor",
        "userdata",
        "cache",
        "data",
      ];

      if (mountMode) {
        exclude = exclude.concat([
          "vbmeta_samsung",
          "vbmeta",
          "userdata",
          "super",
          "recovery",
          "dtbo",
          "boot",
          "up_param",
        ]);
      }

      if (wipeMode) {
        exclude = exclude.concat(["sec_efs", "efs"]);
      }

      let result = [];

      const info = await os.execCommand(`adb shell ls /dev/block/mapper`);
      // console.log(info.stdErr);
      // console.log(info.stdOut);
      if (info.stdOut) {
        const arr = info.stdOut
          .split("\n")
          ?.map((item) => item.replace("\r", ""))
          ?.filter((item) => item && item != "by-uuid");

        // console.log(arr);
        result = result.concat(
          arr.map((item) => {
            return {
              path: "/dev/block/mapper/" + item,
              entry: item,
              mountPoint: item,
            };
          }),
        );
      }

      const blocks = [
        "/dev/block/by-name",
        "/dev/block/platform/11120000.ufs/by-name",
      ];

      for (const block of blocks) {
        const info2 = await os.execCommand(`adb shell ls ${block}`);
        if (info2.stdOut) {
          const arr = info2.stdOut
            .split("\n")
            .map((item) => item.replace("\r", ""))
            ?.filter((item) => item && !exclude.includes(item));

          result = result.concat(
            arr.map((item) => {
              return {
                path: block + "/" + item,
                entry: item,
                mountPoint: item,
              };
            }),
          );
        }
      }

      // console.log(result);
      return result;
    } catch (e) {
      console.log(e);

      return [];
    }
  }

  async flashZipFile(path) {
    // await delay(5000);
    const info = await os.execCommand(`adb shell twrp install ${path}`);
    return info;
  }

  async flashImgFile(path, partitionPath) {
    // await delay(5000);

    // console.log({ path, partitionPath });
    // console.log(`adb shell dd if=${path} of=${partitionPath} bs=1M`);

    const info = await os.execCommand(
      `adb shell dd if=${path} of=${partitionPath} bs=1M`,
    );

    return info;
  }

  async wipe(value) {
    // await delay(5000);
    const info = await os.execCommand(`adb shell twrp wipe ${value}`);
    return info;
  }

  async factoryReset() {
    const info = await os.execCommand("adb shell twrp format data");
    return info;
  }

  async reboot(value) {
    const info = await os.execCommand(`adb reboot ${value}`);
    return info;
  }

  async checkMounted(value) {
    const info = await os.execCommand(`adb shell mount | grep ${value}`);
    if (info.stdErr) return false;
    // console.log(info);

    return info.stdOut.length > 0;
  }

  async mount(value) {
    const info = await os.execCommand(`adb shell twrp mount ${value}`);
    return info;
  }

  async umount(value) {
    // let mValue = value;
    // if (mValue == "system") mValue = "system_root";
    const info = await os.execCommand(`adb shell twrp umount ${value}`);
    return info;
  }

  async mountRw(value) {
    const info = await os.execCommand(`adb shell twrp remountrw ${value}`);

    return info;
  }

  async checkAdbShell() {
    const info = await os.execCommand(`adb shell`);
    return info;
  }

  async checkIsRecovery() {
    const info = await os.execCommand("adb shell ls /");
    if (info.stdErr) return false;
    return info.stdOut.includes("system_root");
  }
}

export default new Command();
