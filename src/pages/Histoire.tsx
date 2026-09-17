// src/pages/Histoire.tsx
// Histoire de la stratégie compétitive : les grandes étapes, génération
// par génération, et les moments marquants de la scène.

export default function Histoire() {
  return (
    <section className="histoire">
      <h1>Histoire de la stratégie compétitive</h1>
      <p className="intro">
        Le Pokémon compétitif n'a pas été inventé par Nintendo : il a été
        découvert, théorisé et organisé par les joueurs, génération après
        génération. Voici les grandes étapes.
      </p>

      <section className="era">
        <h2>Gén. 1-2 (1996-2001) : la découverte du métagame</h2>
        <p>
          Dès les premiers jeux, les joueurs comprennent que tous les Pokémon
          ne se valent pas : le type Psy écrase la première génération, les
          stats cachées existent déjà, et les premières communautés en ligne
          se mettent à classer, tester, théoriser. La deuxième génération
          ajoute les types Ténèbres et Acier justement pour rééquilibrer, plus
          les objets tenus : le métagame devient un vrai sujet, dominé à
          l'époque par des parties très défensives.
        </p>
      </section>

      <section className="era">
        <h2>Gén. 3 (2002) : les fondations du jeu moderne</h2>
        <p>
          Rubis/Saphir introduit les natures, les talents et le système
          EV/IV moderne : la construction d'un Pokémon devient une discipline
          en soi. C'est aussi l'époque où la communauté s'organise : Smogon
          est fondé fin 2004 et popularise le système de tiers (OU, UU...),
          pour que chaque Pokémon ait un format où être jouable. Les premiers
          simulateurs de combat permettent de tester ses équipes sans passer
          des heures d'élevage.
        </p>
      </section>

      <section className="era">
        <h2>Gén. 4 (2006) : la révolution physique/spéciale</h2>
        <p>
          Jusqu'ici, la catégorie d'un coup dépendait de son type (tous les
          coups Feu étaient spéciaux, tous les coups Roche physiques).
          Diamant/Perle sépare enfin physique et spécial coup par coup : des
          Pokémon entiers changent de dimension, les movesets explosent en
          possibilités, et beaucoup considèrent ce moment comme la naissance
          du jeu compétitif tel qu'on le connaît.
        </p>
      </section>

      <section className="era">
        <h2>2009 : le VGC, le circuit officiel</h2>
        <p>
          The Pokémon Company lance le circuit officiel Video Game
          Championships : combats en double, équipes de 4 choisies parmi 6,
          règles renouvelées chaque saison, et un championnat du monde annuel.
          Le VGC devient la deuxième grande scène compétitive à côté des
          formats Smogon, avec ses propres codes : Ray Rizzo y réussit
          l'exploit de trois titres mondiaux consécutifs (2010-2012), et le
          Pachirisu champion du monde 2014 de Se Jun Park reste le symbole
          qu'une lecture fine de la méta peut battre la puissance brute.
        </p>
      </section>

      <section className="era">
        <h2>Gén. 5-6 (2010-2016) : l'ère Showdown</h2>
        <p>
          Le simulateur Pokémon Showdown, lancé en 2011, rend le compétitif
          accessible à tous en deux clics : les stats d'usage mensuelles
          (celles affichées sur ce site) datent de cette ère. Sur le jeu, la
          5G est marquée par les guerres de météo (pluie contre soleil
          permanents), puis la 6G ajoute les méga-évolutions et le type Fée,
          créé pour freiner la domination des Dragons.
        </p>
      </section>

      <section className="era">
        <h2>Gén. 7-8 (2016-2022) : gimmicks et débats de bans</h2>
        <p>
          Capacités Z, puis Dynamax : chaque génération apporte son mécanisme
          spectaculaire, et la communauté débat de sa place en compétitif. Le
          Dynamax finit banni des formats Smogon, un cas d'école du travail
          d'équilibrage communautaire : tester, voter, trancher. Côté VGC,
          Wolfe Glick décroche en 2016 un titre mondial devenu iconique.
        </p>
      </section>

      <section className="era">
        <h2>Gén. 9 et aujourd'hui (2022-...)</h2>
        <p>
          Écarlate/Violet introduit la téracristallisation, qui permet de
          changer de type en plein combat : un outil offensif et défensif à
          la fois, au coeur des débats d'équilibrage depuis. Les Pokémon
          "paradoxes" s'installent au sommet des tiers, et la scène n'a
          jamais été aussi active : les classements et stats d'usage de ce
          site bougent tous les mois, c'est le meilleur endroit pour voir
          l'histoire continuer de s'écrire.
        </p>
      </section>

      <p className="lesson-note">
        Contenu éditorial rédigé pour StratéDex : dates et faits vérifiables
        auprès des communautés citées (Smogon, circuit VGC officiel).
      </p>
    </section>
  );
}
