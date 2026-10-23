import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  console.log("Seeding Dapur Ayam database...");

  // --- Admin user ---
  const passwordHash = await bcrypt.hash("dapurayam-admin-2026", 10);
  const admin = await db.adminUser.upsert({
    where: { email: "admin@dapurayam.com" },
    update: { passwordHash, name: "Owner Dapur Ayam", role: "ADMIN" },
    create: {
      name: "Owner Dapur Ayam",
      email: "admin@dapurayam.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user ready:", admin.email);

  // --- Product categories ---
  const productCategories = [
    {
      name: "Ayam Bumbu Nusantara",
      slug: "ayam-bumbu-nusantara",
      description:
        "Ayam berbumbu khas Nusantara — Kuning, Bali, Rujak, dan varian lainnya.",
    },
    {
      name: "Olahan Ayam",
      slug: "olahan-ayam",
      description:
        "Produk olahan ayam siap masak — nugget, karaage, dan varian lainnya.",
    },
  ];
  const catMap: Record<string, { id: string }> = {};
  for (const c of productCategories) {
    const created = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    catMap[c.slug] = created;
    console.log("Category:", created.name);
  }

  // --- Products ---
  const products = [
    {
      name: "Ayam Pejantan Bumbu Rujak",
      slug: "ayam-bumbu-rujak",
      description:
        "Ayam Pejantan Bumbu Rujak — perpaduan rasa pedas, gurih, dan segar yang khas bumbu rujak Nusantara. Dibuat dari ayam pejantan pilihan dengan daging yang lebih padat dan kenyal, dibumbui rempah pilihan tanpa MSG dan tanpa pengawet. Diproses fresh by order setelah pesanan dikonfirmasi. Tinggal goreng dan siap dinikmati dengan nasi hangat.",
      shortDescription:
        "Pedas, gurih, segar — bumbu rujak khas Nusantara. Fresh by order.",
      price: 35000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-rujak.jpg",
      ingredients:
        "Ayam pejantan, bumbu rujak (cabai, gula merah, terasi, asam jawa, kacang), bawang putih, bawang merah, garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      servingSuggestion:
        "Goreng dalam minyak panas hingga keemasan, sajikan dengan nasi hangat dan lalapan.",
      categorySlug: "ayam-bumbu-nusantara",
      isActive: true,
      isFeatured: true,
      featuredOrder: 1,
      shopeeUrl: "",
      tokopediaUrl: "",
      websiteOrderEnabled: true,
    },
    {
      name: "Ayam Pejantan Bumbu Bali",
      slug: "ayam-penjantan-bumbu-bali",
      description:
        "Ayam Pejantan Bumbu Bali — karakter daging ayam pejantan yang padat berpadu dengan bumbu Bali kaya rempah yang pedas dan harum. Diproses fresh by order tanpa MSG dan tanpa pengawet. Cocok digoreng atau dipanggang, sajikan dengan sambal matah untuk hidangan khas Pulau Dewata di rumah Anda.",
      shortDescription: "Praktis, gurih, kaya rempah — bumbu Bali khas Pulau Dewata.",
      price: 32000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-bali.jpg",
      ingredients:
        "Ayam pejantan, bumbu Bali (cabai merah, bawang merah, bawang putih, kunyit, jahe, lengkuas, serai, daun jeruk), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      servingSuggestion:
        "Cocok digoreng atau dipanggang. Sajikan dengan sambal matah.",
      categorySlug: "ayam-bumbu-nusantara",
      isActive: true,
      isFeatured: true,
      featuredOrder: 2,
      shopeeUrl: "",
      tokopediaUrl: "",
      websiteOrderEnabled: true,
    },
    {
      name: "Chicken Nugget Isi Keju",
      slug: "chicken-nugget",
      description:
        "Chicken Nugget Isi Keju Easy Melt — nugget ayam premium dengan isi keju yang lumer saat digigit. Dibuat dari daging ayam pilihan, lapisan luar yang renyah dan isi keju yang creamy. Tanpa MSG, tanpa pengawet, tanpa filler sintetis. Diproses fresh by order, tinggal goreng 3-5 menit dan siap disajikan sebagai camilan, lauk, atau bekal.",
      shortDescription:
        "Nugget ayam premium isi keju easy melt — gurih, lumer, anti MSG.",
      price: 30000,
      packageSize: "250 gr / pack",
      imageUrl: "/uploads/products/nugget-keju.jpg",
      ingredients:
        "Daging ayam pilihan, keju easy melt, tepung premium, bumbu alami, telur. Tanpa MSG, tanpa pengawet, tanpa pengawet sintetis.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin). Goreng langsung dari kondisi beku, tidak perlu dicairkan terlebih dahulu. Setelah kemasan dibuka, konsumsi dalam waktu 1 bulan.",
      servingSuggestion:
        "Goreng dalam minyak panas 3-5 menit hingga keemasan. Sajikan dengan saus sambal atau mayonnaise.",
      categorySlug: "olahan-ayam",
      isActive: true,
      isFeatured: true,
      featuredOrder: 3,
      shopeeUrl: "",
      tokopediaUrl: "",
      websiteOrderEnabled: true,
    },
    {
      name: "Ayam Pejantan Bumbu Ungkep",
      slug: "ayam-penjantan-bumbu-ungkep",
      description:
        "Ayam Pejantan Bumbu Ungkep — ayam pejantan pilihan yang sudah diungkep dengan bumbu rempah alami hingga meresap sempurna. Setiap pack berisi 1 potong paha + 1 potong dada. Tinggal goreng 2-3 menit untuk hasil empuk, gurih, dan bumbu meresap hingga ke dalam. Tanpa MSG, tanpa pengawet. Diproses fresh by order.",
      shortDescription:
        "Empuk, gurih, meresap — ayam ungkep praktis tinggal goreng.",
      price: 30000,
      packageSize: "1 paha + 1 dada / pack",
      imageUrl: "/uploads/products/bumbu-ungkep.jpg",
      ingredients:
        "Ayam pejantan (paha + dada), bumbu ungkep (bawang putih, bawang merah, ketumbar, kunyit, jahe, daun salam, serai), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      servingSuggestion:
        "Goreng 2-3 menit setelah diungkep. Sajikan hangat dengan nasi dan sambal.",
      categorySlug: "ayam-bumbu-nusantara",
      isActive: true,
      isFeatured: true,
      featuredOrder: 4,
      shopeeUrl: "",
      tokopediaUrl: "",
      websiteOrderEnabled: true,
    },
  ];
  for (const p of products) {
    const { categorySlug, ...rest } = p;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        ...rest,
        categoryId: catMap[categorySlug as string].id,
      },
      create: {
        ...rest,
        categoryId: catMap[categorySlug as string].id,
      },
    });
    console.log("Product:", p.name);
  }

  // --- Article categories ---
  const articleCategories = [
    { name: "Resep Olahan Ayam", slug: "resep-olahan-ayam", description: null },
    {
      name: "Mengenal Daging Ayam",
      slug: "mengenal-daging-ayam",
      description: null,
    },
    { name: "Tips Memasak", slug: "tips-memasak", description: null },
    {
      name: "Penyimpanan dan Penanganan Ayam",
      slug: "penyimpanan-dan-penanganan-ayam",
      description: null,
    },
    {
      name: "Produk dan Informasi Dapur Ayam",
      slug: "produk-dan-informasi-dapur-ayam",
      description: null,
    },
  ];
  const artCatMap: Record<string, { id: string }> = {};
  for (const c of articleCategories) {
    const created = await db.articleCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    artCatMap[c.slug] = created;
    console.log("ArticleCategory:", created.name);
  }

  // --- Articles ---
  const articles = [
    {
      title: "Cara Mengolah Ayam Bumbu Rujak agar Bumbu Meresap",
      slug: "cara-mengolah-ayam-bumbu-rujak-agar-bumbu-meresap",
      excerpt:
        "Tips praktis memasak ayam bumbu rujak agar bumbu meresap sempurna ke dalam daging.",
      categorySlug: "tips-memasak",
      tags: "tips,ayam bumbu rujak,memasak",
      cover:
        "https://placehold.co/1200x600/F5C518/3B2A1A?text=cara-mengolah-ayam-bumbu-rujak",
      content: `## Memahami Karakter Bumbu Rujak

Bumbu rujak memiliki perpaduan rasa pedas, manis, dan asam yang khas. Rempah seperti cabai, gula merah, terasi, dan asam jawa membentuk profil rasa yang kuat. Agar bumbu seperti ini meresap ke dalam daging ayam, diperlukan perlakuan yang tepat sejak persiapan hingga proses pemasakan.

Banyak orang mengira cukup melumuri ayam dengan bumbu lalu langsung menggorengnya. Padahal, bumbu rujak yang kaya rempah memerlukan waktu untuk berinteraksi dengan serat daging. Tanpa teknik yang tepat, bumbu hanya akan menempel di permukaan dan rasa di dalam daging tetap tawar.

## Pilih Potongan Ayam yang Tepat

Potongan ayam yang lebih kecil atau lebih tipis akan lebih mudah menyerap bumbu dibandingkan potongan utuh. Untuk ayam bumbu rujak, potongan paha atau sayap dengan beberapa sayatan halus pada permukaannya akan membantu bumbu masuk lebih dalam. Sayatan ini juga mempercepat proses pemasakan sehingga daging tidak menjadi keras.

Jika menggunakan ayam utuh, sebaiknya potong menjadi 4 hingga 6 bagian. Pastikan setiap potongan memiliki ketebalan yang relatif sama agar pemasakan merata. Setelah dipotong, bilas hingga bersih dan keringkan dengan tisu dapur atau kain bersih. Permukaan yang kering akan membantu bumbu menempel lebih baik.

## Marinasi dengan Urutan yang Tepat

Sebelum melumuri bumbu rujak, oleskan terlebih dahulu bumbu dasar seperti bawang putih, ketumbar, dan garam yang sudah dihaluskan. Bumbu dasar ini membantu membuka pori-pori daging sehingga bumbu utama lebih mudah meresap. Setelah itu, baru masukkan bumbu rujak dan aduk hingga rata.

Untuk hasil maksimal, simpan ayam yang sudah dibumbui di kulkas minimal 30 menit hingga 2 jam. Jika waktu lebih lama, simpan dalam wadah tertutup hingga semalaman. Marinasi yang lebih lama membuat rasa bumbu lebih dalam, namun tetap perlu diperhatikan agar ayam tidak terlalu asin atau pedas berlebihan.

## Teknik Pemasakan yang Membantu Meresap

Saat akan memasak, ada baiknya ayam diungkep sebentar dengan api kecil bersama sisa bumbu. Proses pengunkepan ini membantu bumbu menyerap lebih dalam sekaligus membuat daging lebih empuk. Setelah diungkep, ayam siap digoreng, dipanggang, atau dibakar sesuai selera.

Sajikan ayam bumbu rujak selagi hangat dengan nasi putih, lalapan mentimun, atau sambal tambahan sesuai selera. Dengan teknik yang tepat, setiap gigitan akan terasa penuh dengan rempah dan rasa khas rujak yang menggugah selera.`,
    },
    {
      title: "Mengenal Ayam Penjantan dan Karakteristiknya",
      slug: "mengenal-ayam-penjantan-dan-karakteristiknya",
      excerpt:
        "Apa itu ayam penjantan dan apa yang membedakannya dengan ayam biasa? Simak penjelasan lengkapnya.",
      categorySlug: "mengenal-daging-ayam",
      tags: "ayam penjantan,daging ayam,edukasi",
      cover:
        "https://placehold.co/1200x600/F5C518/3B2A1A?text=mengenal-ayam-penjantan-dan-karakteristiknya",
      content: `## Apa Itu Ayam Penjantan?

Ayam penjantan adalah ayam jantan dewasa yang biasanya dipelihara untuk indentifikasi jenis kelamin pada peternakan ayam petelur. Setelah dewasa, ayam-ayam ini tidak lagi berfungsi untuk produksi telur sehingga sering diolah sebagai bahan pangan. Dagingnya memiliki karakteristik yang berbeda dibandingkan ayam pedaging muda yang biasa kita temui di pasaran.

Bentuk tubuh ayam penjantan cenderung lebih tegap dengan punggung yang lebih tinggi. Bulu-bulu tertentu seperti bulu ekor dan leher tumbuh lebih panjang dan berwarna mencolok. Comb atau jengger yang berdiri tegak juga menjadi tanda khas yang membedakannya dari ayam betina.

## Karakteristik Daging

Daging ayam penjantan umumnya memiliki tekstur yang lebih padat dan keras dibandingkan ayam pedaging muda. Hal ini disebabkan oleh aktivitas fisik yang lebih tinggi serta usia yang lebih tua. Daging paha dan betis memiliki serat yang lebih tebal, sementara daging dada cenderung lebih tebal dan kurang lemak.

Karakter serat yang padat ini membuat daging ayam penjantan cocok untuk olahan yang memerlukan pemasakan lama seperti diungkep, dibakar, atau dipanggang. Bila digoreng langsung tanpa proses awal, daging bisa terasa alot dan kurang empuk. Untuk itu, teknik pengolahan yang tepat sangat menentukan hasil akhir.

## Memilih Ayam Penjantan untuk Olahan

Saat memilih ayam penjantan, perhatikan warna kulit dan aroma daging. Warna kulit yang masih segar biasanya kekuningan cerah atau keputihan, tanpa bau anyir yang berlebihan. Permukaan daging yang terlihat kering atau berlendir sebaiknya dihindari karena bisa menjadi tanda daging sudah tidak segar.

Untuk produk olahan yang sudah dibumbui seperti ayam penjantan bumbu Bali atau bumbu ungkep, pastikan kemasan tertutup rapat dan disimpan pada suhu yang tepat. Produk beku sebaiknya tetap dalam kondisi beku hingga akan digunakan, sementara produk segar perlu segera diolah atau dimasak dalam waktu singkat.

## Cocok untuk Olahan Apa Saja?

Karakter daging yang padat membuat ayam penjantan cocok untuk berbagai olahan berkuah, berbumbu kuat, atau dimasak dengan waktu lama. Olahan tradisional seperti opor, rendang ayam, atau ayam bumbu Bali sangat cocok menggunakan daging ini. Daging yang empuk setelah diungkep mampu menyerap bumbu dengan baik dan menghasilkan rasa yang lebih dalam.

Bagi yang menyukai olahan cepat, ayam penjantan yang sudah diungkep atau dibumbui siap masak bisa menjadi pilihan praktis. Tinggal goreng atau panggang sebentar dan hasilnya sudah siap dinikmati. Kombinasi rasa bumbu yang meresap dan tekstur daging yang khas memberikan pengalaman makan yang berbeda dibandingkan ayam biasa.`,
    },
    {
      title: "Tips Menyimpan Ayam agar Tetap Berkualitas",
      slug: "tips-menyimpan-ayam-agar-tetap-berkualitas",
      excerpt:
        "Panduan menyimpan produk ayam agar tetap segar dan berkualitas hingga dimasak.",
      categorySlug: "penyimpanan-dan-penanganan-ayam",
      tags: "penyimpanan,ayam,tips",
      cover:
        "https://placehold.co/1200x600/F5C518/3B2A1A?text=tips-menyimpan-ayam",
      content: `## Prinsip Dasar Penyimpanan Ayam

Ayam termasuk bahan pangan yang mudah rusak sehingga cara penyimpanan sangat menentukan kualitasnya. Tujuan utama penyimpanan adalah memperlambat pertumbuhan bakteri dan menjaga tekstur serta rasa daging. Penyimpanan yang salah tidak hanya menurunkan kualitas, tetapi juga membuat daging tidak nyaman untuk dikonsumsi.

Setelah membeli produk ayam, sebaiknya segera dimasukkan ke kulkas atau freezer sesuai rencana penggunaan. Jika akan dimasak dalam waktu kurang dari dua hari, simpan di bagian chiller kulkas dengan suhu sekitar 4 derajat Celsius. Untuk penyimpanan lebih lama, gunakan freezer dengan suhu di bawah minus 18 derajat Celsius.

## Penyimpanan di Kulkas (Chiller)

Saat menyimpan ayam di kulkas, letakkan di rak paling bawah untuk mencegah tetesan air menurunki bahan makanan lain. Gunakan wadah tertutup atau bungkus dengan plastik wrap agar daging tidak terkena udara kulkas secara langsung. Udara kulkas yang kering bisa membuat permukaan daging mengeras dan berubah warna.

Untuk produk ayam berbumbu atau olahan yang sudah dibumbui, simpan dalam wadah kedap udara agar bumbu tidak tumpah atau tercemar bau lain. Sebaiknya keluarkan ayam dari kemasan aslinya jika kemasan sudah rusak dan gunakan wadah bersih. Konsumsi produk segar di kulkas paling lama dalam 2 hingga 3 hari.

## Penyimpanan di Freezer

Untuk penyimpanan jangka panjang, freezer adalah pilihan yang tepat. Sebelum membekukan, bagi daging dalam porsi sesuai kebutuhan memasak. Cara ini sangat membantu karena Anda hanya perlu mencairkan porsi yang akan digunakan, sementara sisanya tetap beku dan terjaga kualitasnya.

Bungkus setiap porsi dengan plastik wrap atau simpan dalam wadah kedap udara. Beri label tanggal penyimpanan agar Anda tahu seberapa lama daging sudah disimpan. Sebagai panduan umum, daging ayam utuh dapat disimpan hingga 9 hingga 12 bulan, sementara potongan ayam sebaiknya tidak melebihi 9 bulan untuk kualitas terbaik.

## Cara Mencairkan dengan Aman

Pencairan yang benar adalah bagian penting dari menjaga kualitas daging. Cara paling aman adalah memindahkan daging dari freezer ke kulkas dan membiarkannya mencair perlahan semalaman. Cara ini menjaga tekstur daging dan mengurangi risiko pertumbuhan bakteri.

Hindari mencairkan daging di suhu ruang karena bagian luar akan menjadi hangat sementara bagian dalam masih beku, kondisi yang ideal untuk pertumbuhan bakteri. Jika harus cepat, letakkan daging dalam kantong plastik kedap dan rendam dalam air dingin yang mengalir. Setelah cair, segera masak dan jangan dibekukan ulang tanpa dimasak terlebih dahulu.`,
    },
    {
      title: "Berbagai Cara Mengolah Chicken Nugget",
      slug: "berbagai-cara-mengolah-chicken-nugget",
      excerpt:
        "Lebih dari sekadar digoreng — beberapa ide kreatif mengolah chicken nugget untuk variasi menu harian.",
      categorySlug: "resep-olahan-ayam",
      tags: "nugget,resep,kreatif",
      cover:
        "https://placehold.co/1200x600/F5C518/3B2A1A?text=berbagai-cara-mengolah-chicken-nugget",
      content: `## Nugget Bukan Hanya untuk Digoreng

Chicken nugget sering dianggap sebagai lauk instan yang cukup digoreng dan disajikan dengan saus. Padahal, nugget memiliki potensi besar untuk diolah menjadi berbagai menu menarik. Bentuknya yang praktis dan rasa gurihnya membuat nugget bisa berperan sebagai bahan utama maupun pelengkap dalam banyak hidangan.

Bagi keluarga dengan anak, nugget sering menjadi pilihan karena bentuknya yang mudah dipegang dan rasanya disukai. Dengan sedikit kreativitas, nugget bisa diubah menjadi menu yang lebih bervariasi sehingga anak tidak bosan. Tidak hanya untuk anak, variasi olahan nugget juga bisa menjadi camilan menarik saat berkumpul dengan keluarga.

## Nugget Rice Bowl

Salah satu cara paling sederhana untuk mengubah nugget menjadi menu lengkap adalah dengan menyajikannya dalam rice bowl. Potong nugget yang sudah digoreng menjadi beberapa bagian, lalu susun di atas nasi hangat. Tambahkan sayuran seperti jagung, wortel, atau brokoli yang sudah direbus sebentar.

Untuk memberi rasa, siram dengan saus sambal, mayonnaise, atau saus kecap sesuai selera. Taburan bawang goreng dan daun bawang iris bisa menambah aroma dan tampilan yang lebih menggugah selera. Menu ini cocok untuk bekal atau makan siang praktis yang tetap mengandung karbohidrat, protein, dan sayur.

## Nugget Sandwich dan Wrap

Nugget bisa menjadi pengganti daging dalam sandwich atau wrap. Potong nugget memanjang agar mudah disusun di antara roti atau tortilla. Tambahkan selada, tomat, irisan keju, dan saus favorit untuk melengkapi. Sandwich nugget cocok untuk sarapan atau bekal yang praktis.

Untuk versi wrap, letakkan nugget, sayuran, dan saus di atas tortilla lalu gulung. Padu padan warna dari sayuran membuat tampilan lebih menarik. Menu ini cocok disajikan hangat maupun dingin sehingga fleksibel untuk berbagai situasi.

## Nugget untuk Camilan Berkumpul

Saat berkumpul dengan keluarga atau teman, nugget bisa diolah menjadi camilan yang lebih istimewa. Tusuk nugget yang sudah digoreng dengan tusuk sate, lalu sajikan dengan berbagai saus seperti barbeque, keju, atau madu mustard. Tampilan ini membuat nugget terasa lebih spesial dari sekadar digoreng biasa.

Cara lain adalah dengan memotong nugget kecil-kecil dan mencampurnya ke dalam kentang goreng, lalu taburi dengan keju parut dan saus. Hidangan ini mirip dengan loaded fries yang sering ditemui di kafe. Cocok untuk dinikmati bersama saat menonton acara atau berdiskusi santai.

## Sentuhan Akhir yang Membuat Berbeda

Apapun olahan yang dipilih, kuncinya adalah kreativitas dalam penyajian dan pemilihan saus pelengkap. Saus yang tepat bisa mengubah nuansa nugget secara keseluruhan. Jangan ragu mencoba kombinasi saus yang tidak biasa untuk menemukan rasa favorit baru di rumah.`,
    },
    {
      title: "Perbedaan Ayam Ungkep dan Ayam Berbumbu Siap Masak",
      slug: "perbedaan-ayam-ungkep-dan-ayam-berbumbu-siap-masak",
      excerpt:
        "Memahami perbedaan dua jenis produk ayam olahan agar bisa memilih sesuai kebutuhan.",
      categorySlug: "mengenal-daging-ayam",
      tags: "ayam ungkep,ayam bumbu,perbedaan",
      cover:
        "https://placehold.co/1200x600/F5C518/3B2A1A?text=perbedaan-ayam-ungkep-dan-ayam-berbumbu",
      content: `## Mengapa Memahami Jenis Produk Penting

Di pasaran terdapat berbagai produk olahan ayam yang siap diolah. Dua di antaranya yang sering ditemui adalah ayam ungkep dan ayam berbumbu siap masak. Meski sekilas terlihat mirip, keduanya sebenarnya memiliki perbedaan signifikan dalam proses pembuatan dan cara pengolahan akhir.

Memahami perbedaan kedua produk ini membantu kita memilih yang paling sesuai dengan kebutuhan dan waktu yang tersedia. Bagi yang sibuk, produk yang paling praktis tentu lebih diutamakan. Sementara bagi yang ingin mengolah dengan cara tertentu, produk yang masih mentah dengan bumbu lebih fleksibel.

## Apa Itu Ayam Ungkep

Ayam ungkep adalah ayam yang sudah melalui proses perebusan bersama bumbu dalam waktu tertentu. Proses ini membuat bumbu meresap lebih dalam dan daging menjadi setengah matang hingga matang. Setelah diungkep, ayam biasanya langsung siap untuk digoreng sebentar, dipanggang, atau dibakar tanpa perlu pemasakan lama.

Karakter daging ayam ungkep cenderung lebih empuk dan bumbunya sudah meresap hingga ke dalam serat. Warna daging akan terlihat kecokelatan karena pengaruh bumbu dan proses perebusan. Saat digoreng sebentar setelah diungkep, permukaan akan menjadi keemasan sementara bagian dalam tetap lembap.

## Apa Itu Ayam Berbumbu Siap Masak

Ayam berbumbu siap masak adalah ayam yang sudah dilapisi bumbu di permukaan tetapi belum mengalami proses pemasakan. Daging masih mentah, sehingga bumbu hanya menempel pada lapisan luar. Untuk mendapatkan rasa yang meresap dan daging yang matang, diperlukan pemasakan yang lebih lama dibandingkan ayam ungkep.

Produk ini cocok bagi yang ingin memasak dengan teknik tertentu seperti dipanggang, dibakar, atau digoreng kering. Karena masih mentah, tekstur akhir bisa disesuaikan dengan preferensi, misalnya digoreng krispi atau dipanggang hingga pinggirannya garing. Bumbu yang digunakan juga bervariasi, mulai dari bumbu rujak, bumbu Bali, hingga bumbu kuning.

## Perbedaan dalam Pengolahan Sehari-hari

Dari sisi waktu pengolahan, ayam ungkep jauh lebih cepat. Setelah diungkep, ayam tinggal digoreng 2 hingga 3 menit hingga keemasan. Hal ini sangat membantu bagi yang ingin menyiapkan makanan dalam waktu singkat, misalnya saat sarapan sebelum beraktivitas.

Ayam berbumbu siap masak memerlukan waktu pemasakan yang lebih panjang karena daging masih mentah. Untuk hasil terbaik, kadang perlu ditambahkan teknik marinasi tambahan atau pemasakan bertahap. Produk ini cocok untuk akhir pekan atau saat memiliki waktu lebih untuk memasak dengan tenang.

## Pilih Sesuai Kebutuhan

Tidak ada produk yang lebih baik secara mutlak. Pilihlah sesuai kebutuhan dan situasi. Jika butuh lauk cepat di hari sibuk, ayam ungkep adalah pilihan tepat. Jika ingin olahan dengan teknik tertentu atau rasa bumbu yang lebih kuat dengan kreativitas tambahan, ayam berbumbu siap masak akan lebih fleksibel. Keduanya sama-sama menawarkan kemudahan, tinggal bagaimana kita memanfaatkannya dalam dapur masing-masing.`,
    },
  ];
  for (const a of articles) {
    const { categorySlug, cover, ...rest } = a;
    const data = {
      ...rest,
      coverImageUrl: cover,
      categoryId: artCatMap[categorySlug as string].id,
      authorName: "Tim Dapur Ayam",
      status: "DRAFT",
      publishedAt: null,
      isFeatured: false,
    };
    await db.article.upsert({
      where: { slug: a.slug },
      update: data,
      create: data,
    });
    console.log("Article:", a.title);
  }

  // --- Site settings ---
  await db.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "Dapur Ayam",
      tagline: "Nugget Ayam Praktis untuk Momen Makan Bersama",
      description:
        "Dapur Ayam menghadirkan produk olahan ayam berkualitas yang praktis untuk dinikmati kapan saja.",
      whatsappNumber: "",
      contactEmail: "",
      address: "",
      operationalHours: "",
      instagramUrl: "",
      facebookUrl: "",
      tiktokUrl: "",
      footerText: "© 2026 Dapur Ayam. Semua hak cipta dilindungi.",
      heroHeadline: "Nugget Ayam Praktis untuk Momen Makan Bersama",
      heroSubtext:
        "Nikmati produk olahan ayam berkualitas yang siap diolah kapan saja. Praktis, lezat, dan dibuat dengan bahan pilihan.",
    },
  });
  console.log("Site settings ready");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
